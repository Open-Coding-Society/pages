"""Project imports preserve GitHub status instead of inferring it from issues."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('sync_jarvis_board', ROOT / 'scripts/sync_jarvis_board.py')
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


def fixture():
    groups = []
    items = []
    for index, name in enumerate(['Backlog', 'Ready', 'In progress', 'In review', 'Done']):
        groups.append({'groupId': str(index), 'groupValue': name,
                       'totalCount': {'value': 1, 'isApproximate': False}})
        # Unassigned, open issues must retain their project's actual status.
        card = {'id': index, 'content': {'url': f'{sync.PROJECT_URL}?itemId={index}'},
                'memexProjectColumnValues': [
                    {'memexProjectColumnId': 'Title',
                     'value': {'title': {'raw': '<script> & "title"'}, 'number': index}},
                    {'memexProjectColumnId': 'Assignees', 'value': []},
                ]}
        items.append({'groupId': str(index), 'nodes': [card],
                      'pageInfo': {'hasNextPage': False, 'hasPreviousPage': False}})
    return {'memex-data': {'public': True, 'title': 'Test board'},
            'memex-paginated-items-data': {'groups': {'nodes': groups},
                                         'groupedItems': items,
                                         'totalCount': {'value': 5, 'isApproximate': False}}}


def html(blocks):
    return ''.join(f'<script type="application/json" id="{key}">{json.dumps(value)}</script>'
                   for key, value in blocks.items())


class ProjectImportTests(unittest.TestCase):
    def test_preserves_every_column_and_project_status_for_unassigned_issues(self):
        snapshot = sync.parse_project(html(fixture()), '2026-10-25T01:00:00Z')
        board = snapshot['board']
        self.assertEqual([c['label'] for c in board['columns']],
                         ['Backlog', 'Ready', 'In progress', 'In review', 'Done'])
        self.assertEqual([c['status'] for c in board['cards']],
                         [c['label'] for c in board['columns']])
        self.assertEqual(len(board['cards']), 5)
        self.assertTrue(all(not c['toggle'] for c in board['columns']))
        self.assertEqual(board['cards'][0]['title'], '<script> & "title"')

    def test_rejects_incomplete_pagination_counts_and_private_projects(self):
        original = fixture()
        for change in ('pagination', 'count', 'private', 'duplicates', 'missing-column'):
            with self.subTest(change=change):
                blocks = copy.deepcopy(original)
                data = blocks['memex-paginated-items-data']
                if change == 'pagination':
                    data['groupedItems'][0]['pageInfo']['hasNextPage'] = True
                elif change == 'count':
                    data['totalCount']['value'] = 6
                elif change == 'private':
                    blocks['memex-data']['public'] = False
                elif change == 'duplicates':
                    data['groupedItems'][1]['nodes'][0]['id'] = 0
                else:
                    data['groupedItems'].pop()
                with self.assertRaises(ValueError):
                    sync.parse_project(html(blocks), '2026-10-25T01:00:00Z')

    def test_rejects_non_github_card_links(self):
        blocks = fixture()
        blocks['memex-paginated-items-data']['groupedItems'][0]['nodes'][0]['content']['url'] = 'javascript:alert(1)'
        with self.assertRaises(ValueError):
            sync.parse_project(html(blocks), '2026-10-25T01:00:00Z')


if __name__ == '__main__':
    unittest.main()
