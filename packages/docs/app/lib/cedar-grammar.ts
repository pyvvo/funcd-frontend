import type { LanguageRegistration } from 'shiki';

// A small TextMate grammar for Cedar, the policy language of funcd's built-in
// policies, which Shiki does not ship: comments, annotations, strings, the
// keywords, the scope variables, entity types and method calls.
export const cedarGrammar: LanguageRegistration = {
  name: 'cedar',
  scopeName: 'source.cedar',
  patterns: [
    { include: '#comment' },
    { include: '#annotation' },
    { include: '#string' },
    { include: '#keyword' },
    { include: '#variable' },
    { include: '#constant' },
    { include: '#entity' },
    { include: '#method' },
    { include: '#operator' }
  ],
  repository: {
    comment: { match: '//.*$', name: 'comment.line.double-slash.cedar' },
    annotation: {
      match: '@[A-Za-z_][A-Za-z0-9_]*',
      name: 'storage.type.annotation.cedar'
    },
    string: {
      begin: '"',
      end: '"',
      name: 'string.quoted.double.cedar',
      patterns: [{ match: '\\\\.', name: 'constant.character.escape.cedar' }]
    },
    keyword: {
      match: '\\b(permit|forbid|when|unless|if|then|else|has|like|is|in)\\b',
      name: 'keyword.control.cedar'
    },
    variable: {
      match: '\\b(principal|action|resource|context)\\b',
      name: 'variable.language.cedar'
    },
    constant: {
      match: '\\b(true|false|\\d+)\\b',
      name: 'constant.language.cedar'
    },
    entity: {
      match: '\\b[A-Z][A-Za-z0-9_]*(?=::)',
      name: 'entity.name.type.cedar'
    },
    method: {
      match: '(?<=\\.)[A-Za-z_][A-Za-z0-9_]*(?=\\()',
      name: 'entity.name.function.cedar'
    },
    operator: {
      match: '==|!=|<=|>=|&&|\\|\\||::|[<>!]',
      name: 'keyword.operator.cedar'
    }
  }
};
