import copy
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('sync_board', Path(__file__).parents[1] / 'scripts/sync_fopl_board.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def fixture():
    groups, items = [], []
    for index, name in enumerate(module.STAGES):
        cards = []
        if index < 2:
            repo = 'nathantrieu360/apcspteam' if index == 0 else 'FOPL-Team-2026/bb-pages'
            cards = [{'id': index, 'content': {'url': f'https://github.com/{repo}/issues/1'},
                      'memexProjectColumnValues': [
                          {'memexProjectColumnId': 'Title', 'value': {'title': {'raw': 'Book <search>'}, 'number': 1}},
                          {'memexProjectColumnId': 'Repository', 'value': {'nameWithOwner': repo}},
                          {'memexProjectColumnId': 'Assignees', 'value': [{'login': 'developer'}]},
                      ]}]
        groups.append({'groupId': str(index), 'groupValue': name, 'totalCount': {'value': len(cards)}})
        items.append({'groupId': str(index), 'nodes': cards, 'pageInfo': {'hasNextPage': False}})
    return {'groups': {'nodes': groups, 'pageInfo': {'hasNextPage': False}},
            'groupedItems': items, 'totalCount': {'value': 2}}


def html(data):
    project = {'number': 2, 'public': True, 'title': 'FOPL', 'updatedAt': '2026-10-26T00:00:00Z'}
    return (f'<script type="application/json" id="memex-data">{json.dumps(project)}</script>'
            f'<script type="application/json" id="memex-paginated-items-data">{json.dumps(data)}</script>')


class BoardTests(unittest.TestCase):
    def test_cross_repository_cards_preserve_project_columns(self):
        board = module.snapshot(html(fixture()))
        self.assertEqual(board['count'], 2)
        self.assertEqual([c['label'] for c in board['columns']], list(module.STAGES))
        self.assertEqual(board['columns'][1]['cards'][0]['repository'], 'FOPL-Team-2026/bb-pages')
        self.assertEqual(board['columns'][0]['cards'][0]['title'], 'Book <search>')

    def test_partial_pages_are_rejected(self):
        for level in ('groups', 'column'):
            data = fixture()
            target = data['groups'] if level == 'groups' else data['groupedItems'][0]
            target['pageInfo']['hasNextPage'] = True
            with self.assertRaises(ValueError):
                module.snapshot(html(data))

    def test_count_mismatch_is_rejected(self):
        data = fixture()
        data['totalCount']['value'] += 1
        with self.assertRaises(ValueError):
            module.snapshot(html(data))

    def test_missing_public_data_is_rejected(self):
        with self.assertRaises(KeyError):
            module.snapshot('<html>Sign in</html>')

    def test_unsafe_link_is_rejected(self):
        data = fixture()
        data['groupedItems'][0]['nodes'][0]['content']['url'] = 'javascript:alert(1)'
        with self.assertRaises(ValueError):
            module.snapshot(html(data))


if __name__ == '__main__':
    unittest.main()
