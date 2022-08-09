import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Image from "@theme/IdealImage";
import useThemeContext from "@theme/hooks/useThemeContext";

import styles from "./hero.module.scss";

const HeroAnnouncement = ({ message, linkUrl, linkText }) => (
  <div className={clsx("hero__alert alert alert--primary", styles.hero__alert)}>
    <span>{message}</span>
    {linkUrl && (
      <Link className="button button--primary button--md" href={linkUrl} target="_blank">
        {linkText}
      </Link>
    )}
  </div>
);

const Hero = ({}) => {
  const { isDarkTheme } = useThemeContext();
  return (
    <header className={clsx("hero", styles.hero)}>
      <div className="container">
        {/* HeroAnnouncement goes here */}
        <div className="hero__content">
          <div>
            <h1 className="hero__title">The #1 Open Source Data Catalog</h1>
            <p className="hero__subtitle">
              DataHub's extensible metadata platform enables data discovery, data observability and federated governance that helps tame the
              complexity of your data ecosystem.
            </p>
            <Link className="button button--primary button--lg" to={useBaseUrl("docs/quickstart")}>
              Get Started →
            </Link>
            <Link className="button button--secondary button--outline button--lg" to="https://slack.datahubproject.io">
              Join our Slack
            </Link>
          </div>
        </div>
        <Image
          className="hero__image"
          img={require(`/img/diagrams/datahub-flow-diagram-${isDarkTheme ? "dark" : "light"}.png`)}
          alt="DataHub Flow Diagram"
        />
      </div>
    </header>
  );
};

export default Hero;
