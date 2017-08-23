'use strict';

const expect = require('chai').expect;
const processTemplate = require('../helpers/process-template');
const { builders: b } = require('@glimmer/syntax');
const appendToContent = require('../../lib/helpers/append-to-content');

describe('Helper #appendToContent', function() {
  describe('it can append regular strings', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b, 'bar', attr.value);
        attr.value = appendToContent(b, 'baz', attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).to.equal(`<div class="foo bar baz"></div>`);
  });

  describe('it can append TextNodes to another TextNode', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b, b.text('bar'), attr.value);
        attr.value = appendToContent(b, b.text('baz'), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).to.equal(`<div class="foo bar baz"></div>`);
  });

  describe('it can append PathExpression', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b, b.path('bar'), attr.value);
        attr.value = appendToContent(b, b.path('baz'), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).to.equal(`<div class="foo {{bar}} {{baz}}"></div>`);
  });

  describe('it can append MustacheStatement', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b, b.mustache(b.path('bar')), attr.value);
        attr.value = appendToContent(b, b.mustache(b.path('baz')), attr.value);
        attr.value = appendToContent(b, b.mustache(b.path('if'), [b.path('condition'), b.string('yes'), b.string('no')]), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).to.equal(`<div class="foo {{bar}} {{baz}} {{if condition "yes" "no"}}"></div>`);
  });

  describe('it can mix and append a mix of elements', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b, b.mustache(b.path('one')), b.text(''));
        attr.value = appendToContent(b, b.mustache(b.path('two')), attr.value);
        attr.value = appendToContent(b, b.text('three'), attr.value);
        attr.value = appendToContent(b, 'four', attr.value);
        attr.value = appendToContent(b, b.path('five'), attr.value);
        attr.value = appendToContent(b, b.mustache(b.path('if'), [b.path('condition'), b.string('yes'), b.string('no')]), attr.value);
        attr.value = appendToContent(b, b.path('six'), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).to.equal(`<div class="{{one}} {{two}} three four {{five}} {{if condition "yes" "no"}} {{six}}"></div>`);
  });
});
