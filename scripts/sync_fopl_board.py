"""Publish a complete snapshot of FOPL's public GitHub project (no secret token).

GitHub's public project HTML contains its board data even though the personal
project REST API requires authentication. Fail rather than publish partial data
if GitHub changes this format or starts paginating the project.
"""
import argparse
import json
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen

BOARD_URL = 'https://github.com/users/nathantrieu360/projects/2/views/1'
STAGES = {'To do': 'todo', 'In progress': 'doing', 'In review': 'review', 'Done': 'done'}


class ProjectData(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.active = None
        self.blocks = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script' and attrs.get('type') == 'application/json':
            self.active = attrs.get('id')
            self.blocks[self.active] = ''

    def handle_data(self, data):
        if self.active:
            self.blocks[self.active] += data

    def handle_endtag(self, tag):
        if tag == 'script':
            self.active = None


def snapshot(html):
    parser = ProjectData()
    parser.feed(html)
    project = json.loads(parser.blocks['memex-data'])
    data = json.loads(parser.blocks['memex-paginated-items-data'])
    if not project.get('public') or project.get('number') != 2:
        raise ValueError('Expected public FOPL project 2')
    if data['groups']['pageInfo'].get('hasNextPage'):
        raise ValueError('Project groups are paginated; keeping the previous snapshot')
    columns = []
    groups = {g['groupId']: g for g in data['groupedItems']}
    seen = set()
    for group in data['groups']['nodes']:
        name = group['groupValue']
        if name not in STAGES:
            raise ValueError(f'Unexpected project status: {name!r}')
        items = groups[group['groupId']]
        if items.get('pageInfo', {}).get('hasNextPage'):
            raise ValueError(f'{name} is paginated; keeping the previous snapshot')
        cards = []
        for item in items['nodes']:
            if item['id'] in seen:
                raise ValueError('Duplicate project card')
            seen.add(item['id'])
            fields = {f['memexProjectColumnId']: f['value'] for f in item['memexProjectColumnValues']}
            title = fields['Title']
            repo = fields.get('Repository') or {}
            url = (item.get('content') or {}).get('url') or BOARD_URL
            if not url.startswith('https://github.com/'):
                raise ValueError('Unexpected card URL')
            cards.append({'id': item['id'], 'title': title['title']['raw'], 'url': url,
                          'repository': repo.get('nameWithOwner', ''),
                          'number': title.get('number'),
                          'assignees': [a['login'] for a in fields.get('Assignees', [])]})
        if group['totalCount'].get('isApproximate') or len(cards) != group['totalCount']['value']:
            raise ValueError('Incomplete project column')
        columns.append({'label': name, 'stage': STAGES[name], 'cards': cards})
    if data['totalCount'].get('isApproximate') or len(seen) != data['totalCount']['value']:
        raise ValueError('Incomplete project snapshot')
    return {'title': project['title'], 'url': BOARD_URL, 'updated': project['updatedAt'],
            'count': len(seen), 'columns': columns}


def main():
    args = argparse.ArgumentParser()
    args.add_argument('--html', help='Read a saved public project page for testing')
    args.add_argument('--output', default='_data/fopl_board.json')
    options = args.parse_args()
    if options.html:
        html = Path(options.html).read_text()
    else:
        request = Request(BOARD_URL, headers={'User-Agent': 'FOPL-public-board-sync'})
        with urlopen(request, timeout=30) as response:
            html = response.read().decode('utf-8')
    board = snapshot(html)
    output = Path(options.output)
    if output.exists():
        previous = json.loads(output.read_text())
        previous.pop('synced_at', None)
        if previous == board:
            print('FOPL board is unchanged')
            return
    board['synced_at'] = datetime.now(timezone.utc).isoformat()
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix('.tmp')
    temporary.write_text(json.dumps(board, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(output)
    print(f'Published {board["count"]} FOPL project cards')


if __name__ == '__main__':
    main()
