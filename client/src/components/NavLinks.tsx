import React from "react";

export enum NavFrom {
  thread,
  index,
  catalog,
}

const NavLinks = ({
  uri,
  from,
}: {
  uri: string;
  from: NavFrom;
}): React.ReactElement => {
  if (from === NavFrom.thread) {
    return (
      <div className="navLinks desktop">
        [<a href="../">Index</a>] [<a href="../catalog">Catalog</a>] [
        <a href="#bottom">Bottom</a>]
      </div>
    );
  }
  if (from === NavFrom.index) {
    return (
      <div className="navLinks desktop">
        [<a href={uri + "/catalog"}>Catalog</a>] [<a href="#bottom">Bottom</a>]
      </div>
    );
  }
  if (from === NavFrom.catalog) {
    return (
      <div className="navLinks desktop">
        [<a href={"../" + uri}>Index</a>] [<a href="#bottom">Bottom</a>]
      </div>
    );
  }
  return <></>;
};

export default NavLinks;
