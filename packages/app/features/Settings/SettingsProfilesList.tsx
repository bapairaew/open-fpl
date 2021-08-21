import { useRadioGroup, VStack } from "@chakra-ui/react";
import { useDebouncedCallback } from "use-debounce";
import SettingsProfile from "@open-fpl/app/features/Settings/SettingsProfile";

const SettingsProfilesList = ({
  profiles,
  activeProfile,
  onActiveProfileChange,
  onRemoveProfile,
}: {
  profiles: string[] | null;
  activeProfile: string | null;
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
      {profiles?.map((profile) => {
        const radio = getRadioProps({ value: profile });
        return (
          <SettingsProfile
            key={profile}
            profile={profile}
            radioProps={radio}
            onRemoveClick={() => onRemoveProfile(profile)}
          />
        );
      })}
    </VStack>
  );
};

export default SettingsProfilesList;
