import React from "react";
import "./Widgets.css";
import InfoIcon from "@mui/icons-material/Info";
import { openInNewTab } from "./utils";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function Widgets() {
  const newsArticle = ({ heading, subtitle, link }) => {
    let onclickFn = undefined;
    if (link) {
      onclickFn = openInNewTab(link);
    }

    let subtitleEl = undefined;
    if (subtitle) {
      subtitleEl = <p>{subtitle}</p>;
    }

    return (
      <div className="widgets__article" onClick={onclickFn}>
        <div className="widgets__articleLeft">
          <FiberManualRecordIcon />
        </div>
        <div className="widgets__articleRight">
          <h4>{heading}</h4>
          {subtitleEl}
        </div>
      </div>
    );
  };

  return (
    <div className="widgets">
      <div className="widgets__header">
        <h2>Trending Topic</h2>
        <InfoIcon />
      </div>

      {newsArticle({
        heading: "Stratis To Fund Blockchain Innovation Center in Uganda",
        link: "https://cointelegraph.com/press-releases/stratis-to-fund-blockchain-innovation-center-in-uganda",
      })}
      {newsArticle({
        heading: "The Time To Unlock the True Value of NFTs Is Now",
        link: "https://dailyhodl.com/2022/04/04/the-time-to-unlock-the-true-value-of-nfts-is-now/",
      })}
      {newsArticle({
        heading: "Aza Groups Partners With Yellow Network To Enhance the Acceptance of Crypto",
        link: "https://dailyhodl.com/2022/05/04/aza-groups-partners-with-yellow-network-to-enhance-the-acceptance-of-crypto/",
      })}
      {newsArticle({
        heading: "Algorand Jumps on Massive FIFA Soccer Partnership To Become First Blockchain Sponsor",
        link: "https://dailyhodl.com/2022/05/04/algorand-algo-jumps-on-massive-fifa-soccer-partnership-to-become-first-blockchain-sponsor/",
      })}
      {newsArticle({
        heading: "Why CBDC Is the Key To Achieve Economic Stability",
        link: "https://dailyhodl.com/2022/04/05/why-cbdc-is-the-key-to-achieve-economic-stability/",
      })}
      {newsArticle({
        heading: "Why Are Millennials Running After Crypto Investments?",
        link: "https://dailyhodl.com/2022/04/30/why-are-millennials-running-after-crypto-investments/",
      })}
    </div>
  );
}

export default Widgets;
