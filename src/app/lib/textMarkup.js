// Lightweight parser for the small set of rich-text tags used in TOHO's
// role descriptions ("<color=#RRGGBB>...</color>", "<b>...</b>", "<size=...>...</size>").
// Tags in this dataset do not nest, so a single left-to-right pass is enough.
export function parseMarkup(text) {
  if (!text) return null;

  const nodes = [];
  let key = 0;
  let color = null;
  let bold = false;

  const tagRe = /<(\/?)(color|b|size)(=[^>]*)?>/g;
  let lastIndex = 0;
  let match;

  const pushText = (raw) => {
    if (!raw) return;
    const parts = raw.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) nodes.push(<br key={`br-${key++}`} />);
      if (!part) return;
      const style = {};
      if (color) style.color = color;
      if (bold) style.fontWeight = 700;
      nodes.push(
        <span key={`t-${key++}`} style={style}>
          {part}
        </span>
      );
    });
  };

  while ((match = tagRe.exec(text)) !== null) {
    pushText(text.slice(lastIndex, match.index));
    lastIndex = tagRe.lastIndex;

    const [, closing, tag, attr] = match;
    if (tag === "color") {
      color = closing ? null : (attr || "").replace("=", "");
    } else if (tag === "b") {
      bold = !closing;
    }
    // "size" tags are ignored (no visual size scale on the web page)
  }
  pushText(text.slice(lastIndex));

  return nodes;
}
