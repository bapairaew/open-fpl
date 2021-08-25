import { Table, TableProps, Tbody, Thead } from "@chakra-ui/react";
import {
  ComponentType,
  createContext,
  CSSProperties,
  forwardRef,
  ReactNode,
} from "react";
import {
  FixedSizeList as List,
  FixedSizeListProps,
  ListChildComponentProps,
} from "react-window";

export type StickyHeaderTableContextType = {
  headerRow?: ReactNode;
  stickyCount?: number;
  tableProps?: TableProps;
  ItemRenderer?: ComponentType<
    ListChildComponentProps<StickyHeaderTableContextType>
  >;
};

const StickyHeaderTableElementType = forwardRef<HTMLDivElement>(
  ({ children, ...props }, ref) => {
    return (
      <StickyHeaderTableContext.Consumer>
        {({ headerRow, tableProps = {} }) => (
          <Table {...props} {...tableProps}>
            <Thead>{headerRow}</Thead>
            <Tbody
              // @ts-ignore
              ref={ref}
              display="block"
            >
              {children}
            </Tbody>
          </Table>
        )}
      </StickyHeaderTableContext.Consumer>
    );
  }
);

const ItemWrapper = ({
  data,
  index,
  style,
}: {
  data: StickyHeaderTableContextType;
  index: number;
  style: CSSProperties;
}) => {
  const { ItemRenderer, stickyCount = 1 } = data;
  if (index < stickyCount) {
    return null;
  }
  // TODO: figure out how to surpass this warning
  // @ts-ignore
  return <ItemRenderer index={index - stickyCount} style={style} />;
};

const StickyHeaderTableContext = createContext<StickyHeaderTableContextType>(
  {}
);
StickyHeaderTableContext.displayName = "StickyHeaderTableContext";

// https://codesandbox.io/s/0mk3qwpl4l?file=/src/index.js:280-513
const StickyHeaderTable = ({
  children,
  headerRow,
  stickyCount = 1,
  itemCount,
  tableProps,
  ...props
}: FixedSizeListProps & {
  headerRow: ReactNode;
  stickyCount?: number;
  tableProps?: TableProps;
}) => (
  <StickyHeaderTableContext.Provider
    value={{ ItemRenderer: children, headerRow, stickyCount, tableProps }}
  >
    <List
      itemData={{ ItemRenderer: children, headerRow, stickyCount }}
      innerElementType={StickyHeaderTableElementType}
      itemCount={itemCount + stickyCount}
      {...props}
    >
      {ItemWrapper}
    </List>
  </StickyHeaderTableContext.Provider>
);

export default StickyHeaderTable;
