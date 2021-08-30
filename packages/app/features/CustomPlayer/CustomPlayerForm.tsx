import {
  Alert,
  AlertIcon,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  VStack,
} from "@chakra-ui/react";
import { generateCustomPlayerId } from "@open-fpl/app/features/CustomPlayer/customPlayers";
import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import {
  FormEvent,
  MouseEventHandler,
  MutableRefObject,
  useState,
} from "react";

const positionOptions = ["FWD", "MID", "DEF", "GKP"];

const CustomPlayerForm = ({
  id,
  buttonLabel,
  teams,
  initialFocusRef,
  showCloseButton,
  onCloseClick,
  initialPlayer,
  onSubmit,
}: {
  id: string;
  buttonLabel: string;
  teams: Team[];
  initialFocusRef?: MutableRefObject<HTMLInputElement | null>;
  showCloseButton: boolean;
  onCloseClick: MouseEventHandler<HTMLButtonElement>;
  initialPlayer?: ClientPlayer;
  onSubmit?: (customPlayer: CustomPlayer) => void;
}) => {
  const [formName, setFormName] = useState<string>(
    initialPlayer?.web_name ?? ""
  );
  const [formCost, setFormCost] = useState<string>(
    initialPlayer?.now_cost ? `${initialPlayer.now_cost / 10}` : ""
  );
  const [formPosition, setFormPosition] = useState<string>(
    initialPlayer?.element_type.singular_name_short ?? ""
  );
  const [formTeam, setFormTeam] = useState<string>(
    initialPlayer?.team.short_name ?? ""
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const customPlayer: CustomPlayer = {
      id: initialPlayer?.id ?? generateCustomPlayerId(),
      web_name: formName,
      now_cost: +formCost * 10,
      element_type: {
        singular_name_short: formPosition,
      },
      team: {
        short_name: formTeam,
      },
    };
    onSubmit?.(customPlayer);
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <VStack p={4} borderRadius="md" borderWidth={1} position="relative">
        {showCloseButton && (
          <CloseButton
            position="absolute"
            top={1}
            right={1}
            onClick={onCloseClick}
          />
        )}
        <FormControl id={`${id}-name`} isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            ref={initialFocusRef}
            placeholder="Sancho"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </FormControl>
        <FormControl id={`${id}-cost`} isRequired>
          <FormLabel>Cost</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children="£" />
            <Input
              name="cost"
              type="number"
              placeholder="10"
              min={0}
              step={0.1}
              value={formCost}
              onChange={(e) => setFormCost(e.target.value)}
            />
          </InputGroup>
        </FormControl>
        <FormControl id={`${id}-position`} isRequired>
          <FormLabel>Position</FormLabel>
          <Select
            name="position"
            value={formPosition}
            placeholder="Select position"
            onChange={(e) => setFormPosition(e.target.value)}
          >
            {positionOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl id={`${id}-team`} isRequired>
          <FormLabel>Team</FormLabel>
          <Select
            name="team"
            value={formTeam}
            placeholder="Select a team"
            onChange={(e) => setFormTeam(e.target.value)}
          >
            {teams.map((t) => (
              <option key={t.short_name}>{t.short_name}</option>
            ))}
          </Select>
        </FormControl>
        <Alert status="info">
          <AlertIcon />
          Updating a player's position or team will make the player removed from
          all team plans.
        </Alert>
        <Button mt={2} width="100%" type="submit">
          {buttonLabel}
        </Button>
      </VStack>
    </form>
  );
};

export default CustomPlayerForm;
