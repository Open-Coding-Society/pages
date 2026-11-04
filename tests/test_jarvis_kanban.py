"""Jarvis Kanban integration checks; run after make build."""
import json
import unittest
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PROJECT_URL = 'https://github.com/users/Arnav210/projects/3'


class JarvisKanbanTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = BeautifulSoup(
            (ROOT / '_site/capstone/jarvis/index.html').read_text(), 'html.parser',
        )

    def test_jarvis_board_links_directly_to_project_without_shared_script_changes(self):
        boards = self.page.select('[data-jarvis-kanban]')
        self.assertEqual(len(boards), 1)
        board = boards[0]
        self.assertEqual(board['aria-label'], 'Jarvis3000 Team Kanban')
        link = board.select_one('a')
        self.assertEqual(link['href'], PROJECT_URL)
        self.assertEqual(link['target'], '_blank')
        self.assertIn('noopener', link['rel'])
        self.assertFalse(self.page.select('script[src$="/assets/js/kanban-board.js"]'))
        self.assertIsNotNone(self.page.select_one('.jv-kanban [data-jarvis-kanban]'))

    def test_actual_project_columns_and_all_cards_render_without_javascript(self):
        board = self.page.select_one('[data-jarvis-kanban]')
        source = json.loads((ROOT / '_data/jarvis_board.json').read_text())
        columns = board.select('.ocs__kanban-column')
        self.assertEqual([c.select_one('strong').get_text() for c in columns],
                         [c['label'] for c in source['board']['columns']])
        self.assertEqual(len(board.select('.ocs__kanban-item')), len(source['board']['cards']))
        for rendered, column in zip(columns, source['board']['columns']):
            expected = [c for c in source['board']['cards'] if c['column'] == column['key']]
            self.assertEqual([c['href'] for c in rendered.select('.ocs__kanban-item')],
                             [c['url'] for c in expected])
            self.assertEqual([c.get_text() for c in rendered.select('.ocs__kanban-name')],
                             [c['title'] for c in expected])
        self.assertIn('Project snapshot fetched', board.get_text())

    def test_board_is_near_top_and_existing_overview_content_remains(self):
        headings = [heading.get_text(strip=True) for heading in self.page.select('h2')]
        self.assertLess(headings.index('Team Kanban Board'), headings.index('Problem Statement'))
        for heading in ('System Architecture', 'Core Research Question', 'Hardware Layout',
                        'Project Phases', 'Explore the Project'):
            self.assertIn(heading, headings)
        self.assertIsNotNone(self.page.select_one('a[href="/capstone/jarvis/progress/"]'))
        self.assertIsNotNone(self.page.select_one('a[href="/capstone/jarvis/future-plans/"]'))

    def test_columns_show_five_cards_with_native_expand_and_collapse(self):
        for column in self.page.select('[data-jarvis-kanban] .ocs__kanban-column'):
            cards = column.select('.ocs__kanban-item')
            preview = column.find_all('a', class_='ocs__kanban-item', recursive=False)
            self.assertEqual(len(preview), min(5, len(cards)))
            details = column.find('details')
            if len(cards) <= 5:
                self.assertIsNone(details)
                continue
            self.assertNotIn('open', details.attrs)
            self.assertEqual(details.select_one('.jv-kanban-expand').get_text(),
                             f'+{len(cards) - 5} more')
            self.assertEqual(details.select_one('.jv-kanban-collapse').get_text(), 'Show less')
            self.assertEqual(len(details.select('.ocs__kanban-item')), len(cards) - 5)


if __name__ == '__main__':
    unittest.main()
