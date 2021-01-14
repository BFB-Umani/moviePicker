import ContentText from "moviepicker/components/ContentText/ContentText";
import { WithMarginProps } from "moviepicker/styles/spacing";
import React, { useState } from "react";

import * as Style from "./Tabs.style";
import { ITabs, ITabItem } from "./Tabs.types";

const Tabs: React.FC<ITabs & WithMarginProps> = (props) => {
  const [currentTab, setCurrentTab] = useState(props.initialTab);

  const onTabClick = (tab: ITabItem) => {
    if (tab.onSelect) {
      tab.onSelect(tab.id);
    }
    setCurrentTab(tab.id);
  };

  const getCurrentTabContent = () => {
    const tab = props.tabs.find((t) => t.id === currentTab);
    if (tab) {
      return tab.content;
    }
  };

  return (
    <Style.Container {...props}>
      <Style.TabHeadingContainer>
        {props.tabs.map((tab) => (
          <Style.TabHeading
            key={`tabheading-${tab.id}`}
            selected={currentTab === tab.id}
            onPress={() => onTabClick(tab)}
            activeColor={props.activeColor}
          >
            <ContentText
              type={currentTab === tab.id ? "h5" : "description"}
              color={
                currentTab === tab.id
                  ? props.activeColor || "primary"
                  : "disabled"
              }
              textalign="center"
            >
              {tab.title}
            </ContentText>
          </Style.TabHeading>
        ))}
      </Style.TabHeadingContainer>
      <Style.TabContentContainer>
        {getCurrentTabContent()}
      </Style.TabContentContainer>
    </Style.Container>
  );
};
export default Tabs;
