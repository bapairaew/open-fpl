import { useRadioGroup, VStack } from "@chakra-ui/react";
import { useDebouncedCallback } from "use-debounce";
import SettingsProfile from "~/components/Settings/SettingsProfile";

const SettingsProfilesList = ({
  profiles,
  activeProfile,
  onActiveProfileChange,
  onRemoveProfile,
}) => {
  const debounced = useDebouncedCallback(
    (value) => onActiveProfileChange(value),
    300
  );

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "profiles",
    onChange: debounced,
    value: activeProfile,
  });

  const group = getRootProps();

  return (
    <VStack {...group}>
      {profiles?.map((teamId) => {
        const radio = getRadioProps({ value: teamId });
        return (
          <SettingsProfile
            key={teamId}
            teamId={teamId}
            onRemove={() => onRemoveProfile(teamId)}
            {...radio}
          />
        );
      })}
    </VStack>
  );
};

export default SettingsProfilesList;
