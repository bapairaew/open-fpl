import {
  BoxProps,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getChipDisplayName } from "@open-fpl/app/features/TeamPlanner/chips";
import { ChipUsage } from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import { ChangeEventHandler, ReactNode } from "react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

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
  <ToolbarSection
    label={label}
    width={{ base: "70px", sm: "80px" }}
    textAlign="right"
  >
    <Text
      fontWeight="bold"
      noOfLines={1}
      width="100%"
      fontSize={{ base: "sm", sm: "md" }}
    >
      {data}
    </Text>
  </ToolbarSection>
);

const TeamPlannerToolbar = ({
  bank,
  hits,
  chipUsages,
  freeTransfers,
  planningGameweek,
  currentGameweek,
  onPreviousClick,
  onNextClick,
  onActivatedChipSelectChange,
}: {
  bank: number;
  hits: number;
  chipUsages: ChipUsage[];
  freeTransfers: number;
  planningGameweek: number;
  currentGameweek: number;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onActivatedChipSelectChange: ChangeEventHandler<HTMLSelectElement>;
}) => {
  return (
    <HStack
      px={{ base: 0, sm: 2 }}
      spacing={{ base: 0, sm: 2 }}
      height={{ base: "60px", sm: "50px" }}
      borderBottomWidth={1}
    >
      <Grid
        px={0}
        gridTemplateAreas={{
          base: `"gw gw"
                 "prev next"`,
          sm: `"prev gw next"`,
        }}
      >
        <IconButton
          gridArea="prev"
          disabled={currentGameweek === planningGameweek}
          onClick={onPreviousClick}
          variant="ghost"
          aria-label="previous gameweek"
          icon={<Icon as={IoArrowBackOutline} />}
        />
        <Flex
          gridArea="gw"
          flexShrink={0}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          transform={{ base: "translateY(4px)", sm: "none" }}
        >
          <Heading
            fontSize={{ base: "xs", sm: "md" }}
            width="120px"
            fontWeight="black"
          >
            Gameweek {planningGameweek}
          </Heading>
        </Flex>
        <IconButton
          gridArea="next"
          disabled={planningGameweek === 38}
          onClick={onNextClick}
          variant="ghost"
          aria-label="next gameweek"
          icon={<Icon as={IoArrowForwardOutline} />}
        />
      </Grid>
      <Divider orientation="vertical" />
      <ToolbarStat label="Bank" data={`£${(+bank).toFixed(1)}`} />
      <Divider orientation="vertical" />
      <ToolbarStat label="Free" data={freeTransfers} />
      <Divider orientation="vertical" />
      <ToolbarStat label="Hits" data={hits} />
      <Divider orientation="vertical" />
      <ToolbarSection label="Chip" width="160px" textAlign="left">
        <Select
          height="20px"
          fontWeight="bold"
          variant="unstyled"
          placeholder="Not used"
          rootProps={{ display: "flex" }}
          fontSize={{ base: "xs", sm: "md" }}
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
      <Divider orientation="vertical" display={{ base: "none", sm: "block" }} />
    </HStack>
  );
};

export default TeamPlannerToolbar;
