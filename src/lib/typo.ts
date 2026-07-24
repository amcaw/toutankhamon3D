const nbsp = '\u00A0';

const VERBS =
  'précise|décrit|réagit|détaille|continue|explique|ajoute|souligne|indique|affirme|estime|conclut|rappelle|confirme|insiste|analyse|commente|constate|note';

const attrRe = new RegExp(`,\\s(?:${VERBS})\\s.*?\\.`);

const QUOTE_RE = /«\u00A0([\s\S]*?)\u00A0»/g;

const SKIP_TAGS = new Set(['CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'KBD', 'SAMP']);

function frenchSpacing(text: string): string {
  return text
    .replace(/([^\s\d/])\s*([?!:;])(?=\s|$)/g, `$1${nbsp}$2`)
    .replace(/«\s*/g, `«${nbsp}`)
    .replace(/\s*»/g, `${nbsp}»`);
}

function splitAttribution(text: string) {
  const m = text.match(attrRe);
  if (!m || m.index === undefined) return null;
  return {
    before: text.slice(0, m.index),
    attribution: m[0],
    after: text.slice(m.index + m[0].length).trim()
  };
}

export function typo(html: string): string {
  let result = html.replace(/([^<]*)(<[^>]*>)?/g, (_, text: string, tag: string) => {
    return (text ? frenchSpacing(text) : '') + (tag || '');
  });

  result = result.replace(/«\u00A0(?!<em>)([\s\S]*?)\u00A0»/g, `«${nbsp}<em>$1</em>${nbsp}»`);

  result = result.replace(/<em>([\s\S]*?)<\/em>/g, (match, content: string) => {
    const parts = splitAttribution(content);
    if (!parts) return match;
    return parts.after
      ? `<em>${parts.before}</em>${parts.attribution} <em>${parts.after}</em>`
      : `<em>${parts.before}</em>${parts.attribution}`;
  });

  return result;
}

function textNodesIn(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      let el = node.parentElement;
      while (el && el !== root.parentElement) {
        if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT;
        el = el.parentElement;
      }
      return node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
}

function wrapQuotes(node: Text) {
  const text = node.nodeValue ?? '';
  QUOTE_RE.lastIndex = 0;
  if (!QUOTE_RE.test(text)) return;

  QUOTE_RE.lastIndex = 0;
  const fragment = document.createDocumentFragment();
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = QUOTE_RE.exec(text)) !== null) {
    fragment.append(text.slice(cursor, match.index) + `«${nbsp}`);
    const em = document.createElement('em');
    em.textContent = match[1];
    fragment.append(em, `${nbsp}»`);
    cursor = match.index + match[0].length;
  }

  fragment.append(text.slice(cursor));
  node.replaceWith(fragment);
}

function extractAttributions(root: HTMLElement) {
  for (const em of Array.from(root.querySelectorAll('em'))) {
    if (em.children.length > 0) continue;
    const parts = splitAttribution(em.textContent ?? '');
    if (!parts) continue;

    em.textContent = parts.before;
    const tail: (string | HTMLElement)[] = [parts.attribution];
    if (parts.after) {
      const rest = document.createElement('em');
      rest.textContent = parts.after;
      tail.push(' ', rest);
    }
    em.after(...tail);
  }
}

export function typoAction(node: HTMLElement) {
  const apply = () => {
    for (const text of textNodesIn(node)) {
      const spaced = frenchSpacing(text.nodeValue ?? '');
      if (spaced !== text.nodeValue) text.nodeValue = spaced;
    }
    for (const text of textNodesIn(node)) wrapQuotes(text);
    extractAttributions(node);
  };

  apply();

  return {
    update: apply
  };
}
