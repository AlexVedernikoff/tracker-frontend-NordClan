import React, { FC, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { ExpandItem } from "~/components/ExpandItem";
import * as info from "./styles.scss";

interface InfoCOntainer {
  children: JSX.Element;
}

export const Info: FC<InfoCOntainer> = (props) => {
  const [helpful, setHelpful] = useState(true);
  const [firstDay, setFirstDay] = useState(false);

  return (
    <div className={info.wrapper}>
      <nav className={info.nav}>
        <h2>Информация</h2>

        <ul className={info.menu}>
          <li>
            <Link to="/common-info/philosophy">Философия NordClan</Link>
          </li>

          <ExpandItem
            className={info.noLP}
            title="Полезное сотрундику"
            defaultExpand={helpful}
            input={setHelpful}
          >
            <ul>
              <ExpandItem
                to="/common-info/first-day"
                title="Первый день в компании"
                defaultExpand={firstDay}
                input={setFirstDay}
              >
                <ul>
                  <li>
                    <Link to="/common-info/timesheets">Заполнение ТШ</Link>
                  </li>

                  <li>
                    <Link to="/common-info/memo">Памятка при приеме на работу</Link>
                  </li>

                  <li>
                    <Link to="/common-info/soft-info">Список софта для начала работы</Link>
                  </li>
                </ul>
              </ExpandItem>

              <li>
                <Link to="/common-info/logtime">Как логировать время?</Link>
              </li>
            </ul>
          </ExpandItem>
        </ul>
      </nav>

      <div className={info.content}>
        {props.children}
      </div>
    </div>
  );
};

(Info as any).propTypes = {
  children: PropTypes.any
};
