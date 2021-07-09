import {
  Box,
  Flex,
  BoxProps,
  Link as A,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { Player } from "~/features/AppData/appDataTypes";
import { IoOpenOutline, IoStarOutline, IoStar } from "react-icons/io5";
import { MouseEventHandler } from "react";

const PlayerCardToolbar = ({
  player,
  isStarred,
  onStarClick,
  children,
  ...props
}: BoxProps & {
  player: Player;
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
        <Box>
          <IconButton
            size="xs"
            borderRadius="none"
            aria-label="star player"
            icon={<Icon as={isStarred ? IoStar : IoStarOutline} />}
            variant={isStarred ? "solid" : "ghost"}
            onClick={onStarClick}
          />
        </Box>
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
