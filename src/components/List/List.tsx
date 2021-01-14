import { ColorType } from "moviepicker/styles/colors";
import { WithMarginProps } from "moviepicker/styles/spacing";
import React from "react";
import { TouchableOpacity } from "react-native";

import Box from "../Box/Box";
import ContentText from "../ContentText/ContentText";
import Icon from "../Icon/Icon";
import { IconType } from "../Icon/Icon.types";
import Separator from "../Separator/Separator";
import Skeleton from "../Skeleton/Skeleton";

interface IListItem {
  label: string;
  iconLeft?: IconType;
  iconRight?: IconType;
  color?: ColorType;
  onPress?: () => void;
  asSkeleton?: boolean;
}
interface Props {
  items: IListItem[];
}

const List: React.FC<Props & WithMarginProps> = (props) => (
  <Box {...props}>
    {props.items.map((item, i, list) =>
      !item.asSkeleton ? (
        <TouchableOpacity key={`list-${i}`} onPress={item.onPress}>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            padding="md"
            alignItems="center"
          >
            <Box flexDirection="row" flex={8}>
              {item.iconLeft && (
                <Icon
                  icon={item.iconLeft}
                  size="xxs"
                  marginright="sm"
                  color={item.color}
                />
              )}
              <ContentText type="description" color={item.color}>
                {item.label}
              </ContentText>
            </Box>
            <Box flexDirection="row" justifyContent="flex-end" flex={1}>
              {item.iconRight && (
                <Icon icon={item.iconRight} size="xxs" color={item.color} />
              )}
            </Box>
          </Box>
          {i < list.length - 1 && <Separator color="panel" />}
        </TouchableOpacity>
      ) : (
        <Box paddingbottom="sm" key={`list-skeleton-${i}`}>
          <Box paddingleft="md" paddingright="md">
            <Skeleton size="md" sizeMultiplier={2} />
          </Box>
          {i < list.length - 1 && <Separator color="panel" margintop="sm" />}
        </Box>
      )
    )}
  </Box>
);
export default List;
