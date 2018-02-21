import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('plaid-link', 'Integration | Component | plaid link', {
  integration: true
});

// TODO: Add test
skip('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{plaid-link}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#plaid-link}}
      template block text
    {{/plaid-link}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
