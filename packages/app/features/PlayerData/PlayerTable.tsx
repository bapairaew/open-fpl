import { Table, Tbody, Thead } from "@chakra-ui/react";
import { createContext, CSSProperties, forwardRef } from "react";
import { FixedSizeList as List, FixedSizeListProps } from "react-window";
import playerTableConfigs from "@open-fpl/app/features/PlayerData/playerTableConfigs";
import PlayerTableHeaderRow from "@open-fpl/app/features/PlayerData/PlayerTableHeaderRow";
import {
  PlayerTableContextType,
  PlayerTableSortChangeHandler,
  PlayerTableSortColumnConfig,
} from "@open-fpl/app/features/PlayerData/playerTableTypes";

export const rowHeight = 30;

export const rowWidth = Object.values(playerTableConfigs).reduce(
  (s, w) => s + w.columnWidth,
  0
);

export const PlayerTableElementType = forwardRef<HTMLDivElement>(
  ({ children, ...props }, ref) => (
    <PlayerTableContext.Consumer>
      {({ onSortChange, sortColumns }) => (
        <Table colorScheme="gray">
          <Thead position="sticky" zIndex="sticky" top={0} left={0} bg="white">
            <PlayerTableHeaderRow
              onSortChange={onSortChange}
              sortColumns={sortColumns}
            />
          </Thead>
          <Tbody
            // @ts-ignore
            ref={ref}
            display="block"
            {...props}
          >
            {children}
          </Tbody>
        </Table>
      )}
    </PlayerTableContext.Consumer>
  )
);

const ItemWrapper = ({
  data,
  index,
  style,
}: {
  data: PlayerTableContextType;
  index: number;
  style: CSSProperties;
}) => {
  const { ItemRenderer } = data;
  if (index === 0) {
    return null;
  }
  // TODO: figure out how to surpass this warning
  // @ts-ignore
  return <ItemRenderer index={index} style={style} />;
};

const PlayerTableContext = createContext<PlayerTableContextType>({});
PlayerTableContext.displayName = "PlayerTableContext";

// https://codesandbox.io/s/0mk3qwpl4l?file=/src/index.js:280-513
const PlayerTable = ({
  children,
  onSortChange,
  sortColumns,
  ...props
}: FixedSizeListProps & {
  onSortChange: PlayerTableSortChangeHandler;
  sortColumns: PlayerTableSortColumnConfig[];
}) => (
  <PlayerTableContext.Provider
    value={{ ItemRenderer: children, onSortChange, sortColumns }}
  >
    <List
      itemData={{ ItemRenderer: children, onSortChange, sortColumns }}
      {...props}
    >
      {ItemWrapper}
    </List>
  </PlayerTableContext.Provider>
);

export default PlayerTable;
