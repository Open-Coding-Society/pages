"""Check the built CSSE catalog against the existing game metadata.

Run after make: venv/bin/python -m unittest discover -s tests -p test_csse_capstones.py
"""
import unittest
from pathlib import Path

import yaml
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


class CsseCapstoneTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = BeautifulSoup((ROOT / '_site/capstone/index.html').read_text(), 'html.parser')
        cls.cards = cls.page.select('#capstone-grid > .CSSE')
        cls.games = []
        for path in (ROOT / '_posts').rglob('*.md'):
            text = path.read_text()
            if not text.startswith('---'):
                continue
            try:
                data = yaml.safe_load(text.split('---', 2)[1])
            except yaml.YAMLError:
                continue
            if isinstance(data, dict) and data.get('game_directory') is True and data.get('exclude_from_games') is not True:
                cls.games.append(data)

    def test_every_game_has_one_card_and_original_destination(self):
        self.assertGreater(len(self.games), 0)
        self.assertEqual(len(self.cards), len(self.games))
        self.assertCountEqual([c['data-page-url'].rstrip('/') for c in self.cards],
                              [g['permalink'].rstrip('/') for g in self.games])
        for card in self.cards:
            destination = card['data-page-url']
            self.assertEqual(card.select_one('h3 a')['href'], destination)
            target = ROOT / '_site' / destination.lstrip('/')
            self.assertTrue(target.is_file() or (target / 'index.html').is_file() or target.with_suffix('.html').is_file(), destination)

    def test_cards_preserve_metadata_without_inventing_years(self):
        by_url = {g['permalink'].rstrip('/'): g for g in self.games}
        for card in self.cards:
            game = by_url[card['data-page-url'].rstrip('/')]
            self.assertEqual(card.select_one('h3').get_text(strip=True), game['title'].strip())
            self.assertEqual(card['data-year'], game.get('school_year', ''))
            if game.get('description'):
                self.assertIn(game['description'], card.get_text())
            if game.get('author'):
                self.assertIn(str(game['author']), card.get_text())
            self.assertFalse(card.select('[style]'))

    def test_course_control_and_legacy_link(self):
        self.assertEqual(self.page.select_one('#show-csse').get_text(), 'CSSE')
        self.assertIsNone(self.page.select_one('#year-select option[value="unspecified"]'))
        grid = self.page.select_one('#capstone-grid')
        self.assertEqual(grid.select('.CSSE'), grid.find_all('div', recursive=False)[-len(self.cards):])
        old = BeautifulSoup((ROOT / '_site/cs-pathway/games/index.html').read_text(), 'html.parser')
        self.assertIsNotNone(old.select_one('a[href="/capstone/?course=CSSE"]'))
        self.assertIn('window.location.replace("/capstone/?course=CSSE")', str(old))


if __name__ == '__main__':
    unittest.main()
