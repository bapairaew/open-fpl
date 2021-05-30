import {
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

const ToolbarStat = ({ label, data }) => (
  <VStack spacing={0} width="60px" textAlign="center">
    <Heading size="xs" fontWeight="normal" noOfLines={1} width="100%">
      {label}
    </Heading>
    <Text fontWeight="bold" noOfLines={1} width="100%">
      {data}
    </Text>
  </VStack>
);

const TransferToolbar = ({
  bank,
  hits,
  remainingFreeTransfers,
  planningGameweek,
  currentGameweek,
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <HStack pl={2} spacing={2} height="50px" borderBottomWidth={1}>
      <IconButton
        disabled={currentGameweek === planningGameweek}
        onClick={onPreviousClick}
        variant="ghost"
        size="sm"
        aria-label="previous gameweek"
        icon={<Icon as={IoArrowBackOutline} />}
      />
      <Heading size="sm" fontWeight="black">
        Gameweek {planningGameweek}
      </Heading>
      <IconButton
        disabled={planningGameweek === 38}
        onClick={onNextClick}
        variant="ghost"
        size="sm"
        aria-label="next gameweek"
        icon={<Icon as={IoArrowForwardOutline} />}
      />
      <Divider orientation="vertical" />
      <ToolbarStat label="Bank" data={`£${+bank.toFixed(1)}`} />
      <Divider orientation="vertical" />
      <ToolbarStat label="Free" data={remainingFreeTransfers} />
      <Divider orientation="vertical" />
      <ToolbarStat label="Hits" data={hits} />
      <Divider orientation="vertical" />
    </HStack>
  );
};

export default TransferToolbar;
