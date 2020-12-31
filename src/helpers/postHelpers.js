const regs = {
  quote: /^>[^>].+/,
  quoteLink: />>\d+/
}

export const formatComment = ( threadId, comment ) => {
  let lines = comment.split("\n");
  
  for (let i in lines) {
    if (lines[i].match(regs.quote)) {
      lines[i] = <span class="quote">{lines[i] + "\n"}</span>
      // i == 0 ? lines[i] = newLine(lines[i] + "\n") :
    }

    else if (lines[i].match(regs.quoteLink)) {
      let replyQuote = lines[i].match(regs.quoteLink)[0];
      let postLinked = replyQuote.slice(2);
      let surrounding = lines[i].split(regs.quoteLink);
      let newLine =
        <div>
          {surrounding[0]}
          <a href={"#p" + postLinked} class="quotelink">{replyQuote}</a>
          {surrounding[1] + "\n"}
        </div>

      lines[i] = newLine;
    } else {
      lines[i] = lines[i] + "\n"
    }
  }

  return lines;
}