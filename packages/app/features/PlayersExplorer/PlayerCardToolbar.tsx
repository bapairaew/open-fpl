import {
  Box,
  Flex,
  BoxProps,
  Link as A,
  Icon,
  IconButton,
  Checkbox,
} from "@chakra-ui/react";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { IoOpenOutline, IoStarOutline, IoStar } from "react-icons/io5";
import { ChangeEvent, MouseEventHandler } from "react";

const PlayerCardToolbar = ({
  player,
  isSelected,
  onSelectChange,
  isStarred,
  onStarClick,
  children,
  ...props
}: BoxProps & {
  player: Player;
  isSelected: boolean;
  onSelectChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isStarred: boolean;
  onStarClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Box fontSize="sm" {...props}>
      <Flex
        borderWidth={1}
        borderBottomWidth={0}
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex>
          <Checkbox
            m={0.5}
            size="lg"
            aria-label="select player"
            borderWidth={0}
            isChecked={isSelected}
            onChange={onSelectChange}
            borderRadius="none"
          />
          <IconButton
            size="xs"
            borderRadius="none"
            aria-label={isStarred ? "remove star player" : "add star player"}
            icon={<Icon as={isStarred ? IoStar : IoStarOutline} />}
            variant={isStarred ? "solid" : "ghost"}
            onClick={onStarClick}
          />
        </Flex>
        <Box pr={2}>
          {player.linked_data?.understat_id && (
            <A
              href={`https://understat.com/player/${player.linked_data.understat_id}`}
              isExternal
            >
              Understat <Icon as={IoOpenOutline} />
            </A>
          )}
        </Box>
      </Flex>
      {children}
    </Box>
  );
};

export default PlayerCardToolbar;
