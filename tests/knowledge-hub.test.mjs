import assert from 'node:assert/strict';
import test from 'node:test';
import * as routes from '../src/knowledge/route.js';
import * as registry from '../src/knowledge/articles.js';

test('knowledge index is distinct from article and home routes', () => {
  assert.equal(routes.KNOWLEDGE_INDEX_HASH, '#/knowledge');
  assert.equal(routes.isKnowledgeIndexRoute('#/knowledge'), true);
  for (const hash of ['#knowledge', '#/knowledge/diode', '#/knowledge/unknown', '']) assert.equal(routes.isKnowledgeIndexRoute(hash), false);
  assert.equal(routes.resolveKnowledgeRoute('#/knowledge/diode'), 'diode');
});
test('library search matches title, summary and chapter, and combines filters', () => {
  assert.equal(typeof registry.filterReviewArticles, 'function');
  const filter = registry.filterReviewArticles;
  assert.deepEqual(filter('', 'all'), registry.reviewArticles);
  assert.ok(filter('  rGmIi  ').some(a => a.slug === 'gigabit-ethernet'));
  assert.deepEqual(filter('高速接口'), registry.reviewArticles.filter(a => a.chapter === 'high-speed-interfaces'));
  assert.ok(filter('RC 上升时间').some(a => a.slug === 'iic-spi'));
  assert.equal(filter('RGMII', 'passive').length, 0);
  assert.equal(filter('不存在的词xyz').length, 0);
  assert.deepEqual(filter('', 'si-pi'), registry.reviewArticles.filter(a => a.chapter === 'si-pi'));
});
