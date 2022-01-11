import React, { FC, useState } from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";
import * as styles from "./ExpandItem.scss";
import classNames from "classnames";

interface ExpandItemProps {
  children: JSX.Element;
  to?: string;
  title?: string;
  defaultExpand?: boolean;
  input?: (v: boolean) => any;
  className?: string;
}

export const ExpandItem: FC<ExpandItemProps> = ({
                                                  children,
                                                  to,
                                                  title = "title",
                                                  defaultExpand = false,
                                                  input = () => {
                                                  },
                                                  className = ""
                                                }) => {
  const [expand, setExpand] = useState(defaultExpand);

  const toggle = () => {
    setExpand(!expand);
    input(!expand);
  };

  return (
    <li className={classNames(styles.expandItem, className)}>
      <span>
        <button onClick={toggle}>
          <span
            dangerouslySetInnerHTML={{ __html: "&#5171;" }}
            className={classNames(styles.buttonIcon, expand ? styles.buttonIconDown : null)}
          />
        </button>

        <Link to={to}>{title}</Link>
      </span>
      {expand ? children : null}
    </li>
  );
};

(ExpandItem as any).propTypes = {
  children: PropTypes.any,
  to: PropTypes.string,
  title: PropTypes.string,
  defaultExpand: PropTypes.bool,
  input: PropTypes.func,
  className: PropTypes.string
};
