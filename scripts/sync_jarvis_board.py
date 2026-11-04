"""Import the public Jarvis GitHub Project, preserving its actual statuses.

GitHub's personal-project REST API requires authentication. Its public HTML
contains the board data instead. Reject partial pages rather than losing cards.
"""
import argparse
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
from pathlib import Path
import sys
from urllib.request import Request, urlopen

PROJECT_URL = 'https://github.com/users/Arnav210/projects/3'
OUTPUT = Path(__file__).resolve().parents[1] / '_data/jarvis_board.json'
STAGES = {'backlog': 'backlog', 'ready': 'todo', 'to do': 'todo',
          'in progress': 'doing', 'in review': 'review', 'done': 'done'}


class ProjectDataParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.blocks = {}
        self.block_id = None
        self.parts = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == 'script' and attributes.get('id') in (
            'memex-data', 'memex-paginated-items-data',
        ):
            self.block_id = attributes['id']
            self.parts = []

    def handle_data(self, data):
        if self.block_id:
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag == 'script' and self.block_id:
            self.blocks[self.block_id] = json.loads(''.join(self.parts))
            self.block_id = None


def project_card(item, column):
    values = {value['memexProjectColumnId']: value['value']
              for value in item['memexProjectColumnValues']}
    title = values.get('Title') or {}
    content = item.get('content') or {}
    url = content.get('url') or f'{PROJECT_URL}?pane=issue&itemId={item["id"]}'
    if not url.startswith('https://github.com/'):
        raise ValueError('Project card has an unexpected URL')
    people = [person['login'] for person in values.get('Assignees') or []]
    return {
        'id': item['id'], 'title': title['title']['raw'], 'url': url,
        'number': title.get('number'), 'stage': column['stage'],
        'status': column['label'], 'column': column['key'],
        'group': people[0] if people else '', 'people': people,
    }


def parse_project(html, fetched_at):
    parser = ProjectDataParser()
    parser.feed(html)
    project = parser.blocks['memex-data']
    if project.get('public') is not True:
        raise ValueError('Jarvis project must be public')
    data = parser.blocks['memex-paginated-items-data']
    columns = []
    cards = []
    grouped = {group['groupId']: group for group in data['groupedItems']}
    for group in data['groups']['nodes']:
        name = group['groupValue'] or 'No status'
        column = {'key': group['groupId'], 'label': name,
                  'stage': STAGES.get(name.lower()), 'toggle': False}
        columns.append(column)
        items = grouped.get(group['groupId'], {'nodes': [], 'pageInfo': {}})
        count = group['totalCount']
        if (items['pageInfo'].get('hasNextPage') or
                items['pageInfo'].get('hasPreviousPage') or
                count.get('isApproximate') or len(items['nodes']) != count['value']):
            raise ValueError(f'Incomplete project column: {name}')
        cards.extend(project_card(item, column) for item in items['nodes'])
    if (data['totalCount'].get('isApproximate') or
            len(cards) != data['totalCount']['value'] or
            len({card['id'] for card in cards}) != len(cards) or not columns):
        raise ValueError('Incomplete or duplicate project cards')
    people = sorted({card['group'] for card in cards if card['group']})
    return {'fetchedAt': fetched_at, 'board': {
        'title': project['title'], 'url': PROJECT_URL, 'filterName': 'Assignee',
        'groups': people, 'shared': [], 'columns': columns, 'cards': cards,
        'updated': project.get('updatedAt'),
    }}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--allow-cached', action='store_true')
    args = parser.parse_args()
    try:
        request = Request(PROJECT_URL, headers={'User-Agent': 'OCS-Jarvis-Board'})
        with urlopen(request, timeout=25) as response:
            html = response.read().decode('utf-8')
        snapshot = parse_project(html, datetime.now(timezone.utc).isoformat())
    except (OSError, ValueError, KeyError, TypeError) as error:
        if not args.allow_cached or not OUTPUT.is_file():
            raise RuntimeError(f'Could not refresh Jarvis project: {error}') from error
        cached = json.loads(OUTPUT.read_text())
        print(f'WARNING: Could not refresh Jarvis project: {error}. '
              f'Using snapshot from {cached["fetchedAt"]}.', file=sys.stderr)
        return
    OUTPUT.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + '\n')
    print(f'Jarvis project: imported {len(snapshot["board"]["cards"])} cards '
          f'in {len(snapshot["board"]["columns"])} columns.')


if __name__ == '__main__':
    main()
