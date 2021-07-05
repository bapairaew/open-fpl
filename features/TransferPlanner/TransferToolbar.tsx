import {
  BoxProps,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChangeEventHandler, ReactNode } from "react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { getChipDisplayName } from "~/features/TransferPlanner/chips";
import { ChipUsage } from "~/features/TransferPlanner/transferPlannerTypes";

const ToolbarSection = ({
  label,
  children,
  ...props
}: BoxProps & {
  label: ReactNode;
  children: ReactNode;
}) => {
  return (
    <VStack spacing={0} px={2} {...props}>
      <Heading
        size="xs"
        fontWeight="normal"
        noOfLines={1}
        width="100%"
        color="gray.600"
      >
        {label}
      </Heading>
      {children}
    </VStack>
  );
};

const ToolbarStat = ({
  label,
  data,
}: {
  label: ReactNode;
  data: ReactNode;
}) => (
  <ToolbarSection label={label} width="80px" textAlign="right">
    <Text fontWeight="bold" noOfLines={1} width="100%">
      {data}
    </Text>
  </ToolbarSection>
);

const TransferToolbar = ({
  bank,
  hits,
  chipUsages,
  remainingFreeTransfers,
  planningGameweek,
  currentGameweek,
  onPreviousClick,
  onNextClick,
  onActivatedChipSelectChange,
}: {
  bank: number;
  hits: number;
  chipUsages: ChipUsage[];
  remainingFreeTransfers: number;
  planningGameweek: number;
  currentGameweek: number;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onActivatedChipSelectChange: ChangeEventHandler<HTMLSelectElement>;
}) => {
  return (
    <HStack px={2} spacing={2} height="50px" borderBottomWidth={1}>
      <IconButton
        disabled={currentGameweek === planningGameweek}
        onClick={onPreviousClick}
        variant="ghost"
        size="sm"
        aria-label="previous gameweek"
        icon={<Icon as={IoArrowBackOutline} />}
      />
      <Heading size="sm" fontWeight="black" width="120px">
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
      <ToolbarSection label="Chip" width="160px" textAlign="left">
        <Select
          height="20px"
          fontWeight="bold"
          variant="unstyled"
          placeholder="Not used"
          value={chipUsages.find((c) => c.isActive)?.name ?? ""}
          onChange={onActivatedChipSelectChange}
        >
          {chipUsages.map((c) => (
            <option key={c.name} disabled={c.isUsed} value={c.name}>
              {getChipDisplayName(c.name)}
            </option>
          ))}
        </Select>
      </ToolbarSection>
      <Divider orientation="vertical" />
    </HStack>
  );
};

export default TransferToolbar;
