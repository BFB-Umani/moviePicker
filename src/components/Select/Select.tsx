import modalMethods from "moviepicker/reduxStore/modal/modal.methods";
import { IModal } from "moviepicker/reduxStore/store.types";
import React, { useEffect, useRef, useState } from "react";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { connect } from "react-redux";

import Box from "../Box/Box";
import ContentText from "../ContentText/ContentText";
import * as Style from "./Select.style";
import { ISelect, ISelectListItem } from "./Select.types";

const Select: React.FC<ISelect & IDispatchProps> = (props) => {
  const modalizeRef = useRef<Modalize>(null);
  const [currentItem, setCurrentItem] = useState<ISelectListItem>();

  useEffect(() => {
    if (props.selected) {
      setCurrentItem(props.list.find((i) => i.value === props.selected));
    }
  }, [props.selected]);

  const onSelectItem = (val: ISelectListItem["value"]) => () => {
    modalizeRef.current?.close();
    props.onChange(val);
  };

  const onLabelClick = () => {
    modalizeRef.current?.open();
  };

  return (
    <>
      <Style.Container disabled={props.disabled} onPress={onLabelClick}>
        {currentItem && <Style.Label>{currentItem.label}</Style.Label>}
        <Style.SelectIcon name="chevron-right" size={14} />
      </Style.Container>
      <Portal>
        <Modalize
          ref={modalizeRef}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          adjustToContentHeight={true}
          HeaderComponent={
            <Box paddingleft="md" paddingright="md" paddingtop="md">
              <ContentText type="h3">{props.title}</ContentText>
            </Box>
          }
        >
          <Box padding="md">
            {props.list.map((item, i) => (
              <Style.SelectListItem
                key={i}
                onPress={onSelectItem(item.value)}
                selected={item.value === currentItem?.value}
              >
                <Style.SelectListItemLabel
                  selected={item.value === currentItem?.value}
                >
                  {item.label}
                </Style.SelectListItemLabel>
                {item.value === currentItem?.value && (
                  <Style.SelectListItemCheck name="check" size={18} />
                )}
              </Style.SelectListItem>
            ))}
          </Box>
        </Modalize>
      </Portal>
    </>
  );
};

interface IDispatchProps {
  createModal: (modal: IModal) => void;
  closeModal: (id: IModal["id"]) => void;
}
const mapDispatchToProps: IDispatchProps = {
  createModal: modalMethods.createModal,
  closeModal: modalMethods.closeModal,
};

export default connect(null, mapDispatchToProps)(Select);
