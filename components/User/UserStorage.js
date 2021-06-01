import { VStack, Box, Heading, Text, IconButton, Icon } from "@chakra-ui/react";
import { useMemo } from "react";
import { IoTrashBinOutline, IoArrowUndoCircleOutline } from "react-icons/io5";
import { getUserTeamChangesKey } from "~/components/User/storage";
import { nFormatter } from "~/libs/numbers";

const transferPlanVariants = {
  default: {
    iconLabel: "revert",
    icon: IoTrashBinOutline,
  },
  remove: {
    textDecoration: "line-through",
    opacity: 0.5,
    iconLabel: "remove",
    icon: IoArrowUndoCircleOutline,
  },
};

const TransferPlan = ({ plan, onRemoveClick, variant }) => {
  const { icon, iconLabel, ...variantProp } =
    transferPlanVariants[variant] ?? transferPlanVariants.default;
  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      width="100%"
      px={4}
      py={2}
      position="relative"
      {...variantProp}
    >
      <Heading size="xs" my={2}>
        Transfer plan {plan.teamId}
      </Heading>
      <Text color="gray" fontSize="xs">
        Size {nFormatter(plan.size, 1)}b
      </Text>
      <IconButton
        position="absolute"
        top={2}
        right={2}
        size="sm"
        variant="ghost"
        aria-label={iconLabel}
        icon={<Icon as={icon} />}
        onClick={() => onRemoveClick(plan)}
      />
    </Box>
  );
};

const UserStorage = ({ storage, plansToRemove, onStorageChange }) => {
  const userTeamChangesPattern = getUserTeamChangesKey("(\\d+)");
  const transferPlans = useMemo(() => {
    if (!storage) return [];
    return Object.keys(storage).reduce((plans, key) => {
      const match = key.match(userTeamChangesPattern);
      if (match) {
        plans.push({
          teamId: match[1],
          size: new TextEncoder().encode(storage.getItem(key)).length,
        });
      }
      return plans;
    }, []);
  }, [storage]);

  const size = Object.values(storage).join("").length;

  const handleRemovePlan = (plan) => {
    let plans;
    if (plansToRemove.includes(plan)) {
      plans = plansToRemove.filter((p) => p !== plan);
    } else {
      plans = [...plansToRemove, plan];
    }
    onStorageChange({
      plansToRemove: plans,
    });
  };

  if (transferPlans.length === 0) {
    return (
      <Box py={2} color="gray">
        No storage found
      </Box>
    );
  }

  return (
    <>
      <VStack>
        {transferPlans.map((plan) => (
          <TransferPlan
            key={plan.teamId}
            plan={plan}
            variant={plansToRemove?.includes(plan) ? "remove" : "default"}
            onRemoveClick={() => handleRemovePlan(plan)}
          />
        ))}
      </VStack>
    </>
  );
};

export default UserStorage;
