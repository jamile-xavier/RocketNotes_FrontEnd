import { RiShutDownLine } from "react-icons/ri";
import { Container, Profile, Logout } from "./styles";

export function Header() {
  return (
    <Container>
      <Profile to="/profile">
        <img src="https://github.com/jamile-xavier.png" alt="Foto do usuário" />
        <div>
          <span>Bem vindo (a)</span>
          <strong>Jamile Xavier</strong>
        </div>
      </Profile>

      <Logout>
        <RiShutDownLine />
      </Logout>
    </Container>
  );
}
