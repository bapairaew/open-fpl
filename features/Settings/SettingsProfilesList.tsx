import { useRadioGroup, VStack } from "@chakra-ui/react";
import { useDebouncedCallback } from "use-debounce";
import SettingsProfile from "~/features/Settings/SettingsProfile";

const SettingsProfilesList = ({
  profiles,
  activeProfile,
  onActiveProfileChange,
  onRemoveProfile,
}: {
  profiles: string[] | null | undefined;
  activeProfile: string | null | undefined;
  onActiveProfileChange: (id: string) => void;
  onRemoveProfile: (id: string) => void;
}) => {
  const debounced = useDebouncedCallback(
    (value) => onActiveProfileChange(value),
    300
  );

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "profiles",
    onChange: debounced,
    value: activeProfile ?? undefined,
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
            radioProps={radio}
          />
        );
      })}
    </VStack>
  );
};

export default SettingsProfilesList;
