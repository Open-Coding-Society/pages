"""PNEC integration checks; run after make build with unittest discovery."""
import unittest
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


class PnecKanbanTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = BeautifulSoup(
            (ROOT / '_site/capstone/powaynec-2026-2027/index.html').read_text(),
            'html.parser',
        )

    def test_public_issue_board_uses_shared_component_and_assignee_filter(self):
        boards = self.page.select('[data-ocs-kanban]')
        self.assertEqual(len(boards), 1)
        board = boards[0]
        self.assertEqual(board['data-board-url'],
                         'https://github.com/samanviy17-crypto/team-portfolio/issues')
        self.assertEqual(board['data-filter'], 'Assignee')
        self.assertEqual(board.select_one('[data-hook="title"]').get_text(), 'PNEC Team Kanban')
        self.assertEqual(board.select_one('a')['href'], board['data-board-url'])
        self.assertEqual(len(self.page.select('script[src="/assets/js/kanban-board.js"]')), 1)

    def test_personal_project_remains_accessible_and_columns_are_explained(self):
        link = self.page.select_one(
            'a[href="https://github.com/users/samanviy17-crypto/projects/1/views/1"]'
        )
        self.assertIsNotNone(link)
        self.assertEqual(link['target'], '_blank')
        self.assertIn('noopener', link['rel'])
        self.assertIn('derived from issue data', self.page.get_text())
        self.assertIn("first assignee", self.page.get_text())
        self.assertNotIn('Live cards, filters, and card metadata are unavailable', self.page.get_text())

    def test_existing_microblog_and_capstone_sections_remain(self):
        self.assertEqual(len(self.page.select('#microblog-toggle-btn')), 1)
        self.assertEqual(len(self.page.select('#microblog-panel')), 1)
        for anchor in ('project-overview', 'proposed-improvements', 'team-and-review',
                       'delivery-lifecycle', 'real-project-evidence', 'microblog-updates',
                       'next-iteration'):
            with self.subTest(anchor=anchor):
                self.assertIsNotNone(self.page.find(id=anchor))


if __name__ == '__main__':
    unittest.main()
