import {
  Box,
  Flex,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
  useColorMode,
  useColorModeValue,
  Center,
  Image,
  Button,
} from "@chakra-ui/react";

import { useCallback, useEffect, useState } from "react";
import { RiChatSettingsLine } from "react-icons/ri";
import { api } from "./services/api";

interface itemCard {
  code: string;
  image: string;
  images: {
    png: string;
    svg: string;
  };
  suit: string;
  value: string;
}

interface PropsData {
  cards: itemCard[];
  deck_id: string;
  remaining: number;
  success: boolean;
}

function App() {
  const bg = useColorModeValue("gray.50", "gray.800");
  const color = useColorModeValue("gray.700", "gray.50");
  const { colorMode, toggleColorMode } = useColorMode();

  const [playerOneCard, setPlayerOneCard] = useState({} as PropsData);
  const [playerTwoCard, setPlayerTwoCard] = useState({} as PropsData);
  const [changevalue, setChangeValue] = useState(false);

  const getCard = useCallback(async () => {
    const { data } = await api.get("new/shuffle/?deck_count=1");

    const card = await api.get(`${data.deck_id}/draw/?count=2`);
    return card.data;
  }, []);

  function handlerRandom() {
    setChangeValue(!changevalue);
  }

  useEffect(() => {
    try {
      const loads = async () => {
        const playerOne = await getCard();
        const playerTwo = await getCard();

        setPlayerOneCard(playerOne);
        setPlayerTwoCard(playerTwo);
      };

      loads();
    } catch (error) {}
  }, [changevalue]);

  return (
    <Flex flexDir="column" minH="100vh" mb="4">
      <Flex
        as="header"
        w="100%"
        maxW={1480}
        h="20"
        mx="auto"
        mt="4"
        px="6"
        align="center"
      >
        <Text
          fontSize={["2xl", "3xl"]}
          fontWeight="bold"
          letterSpacing="tight"
          w="64"
        >
          CardGame
          <Text as="span" ml="1" color="red.500">
            .
          </Text>
        </Text>

        <Button
          onClick={handlerRandom}
          backgroundColor="green.600"
          borderRadius="4"
          borderColor="gray.600"
        >
          Jogar novamente
        </Button>

        <Flex align="center" ml="auto">
          <IconButton
            aria-label="color mode"
            icon={<Icon as={RiChatSettingsLine} />}
            fontSize="24"
            variant="unstyled"
            onClick={toggleColorMode}
            mr="2"
          />
        </Flex>
      </Flex>
      <Flex w="100%" my="6" maxWidth="1480" mx="auto" px="6">
        <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
          <Box p={["6", "8"]} bg={bg} borderRadius={8} pb="4">
            <Center>
              <Text fontSize="lg" mb="4">
                Jogador 1
              </Text>
            </Center>

            {playerOneCard?.cards?.map((card: itemCard) => (
              <Flex key={card.code} flexDir="column" align="center">
                <Image
                  objectFit="contain"
                  w="210"
                  h="210"
                  src={card?.images.svg}
                />
                <Text>{card?.suit}</Text>
                <Text>{card?.value}</Text>
              </Flex>
            ))}
          </Box>

          <Box p={["6", "8"]} bg={bg} borderRadius={8} pb="4">
            <Center>
              <Text fontSize="lg" mb="4">
                Jogador 2
              </Text>
            </Center>

            {playerTwoCard?.cards?.map((card: itemCard) => (
              <Flex key={card.code} flexDir="column" align="center">
                <Image
                  objectFit="contain"
                  w="210"
                  h="210"
                  src={card?.images.svg}
                />
                <Text>{card?.suit}</Text>
                <Text>{card?.value}</Text>
              </Flex>
            ))}
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}

export default App;
