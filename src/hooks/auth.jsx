import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

//contexto de autenticação
export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState({});

  // se colocar (email, senha) os itens tem que ser digitados nessa ordem, se colocar ({email,senha}) precisa pegar os itens sem importar a ordem de digitação
  async function signIn({ email, password }) {
    try {
      const response = await api.post("sessions", { email, password });
      const { user, token } = response.data;

      // guardar os dados separadps pra ficar mais fácil trabalhar
      localStorage.setItem("@rocketnotes:user", JSON.stringify(user));
      localStorage.setItem("@rocketnotes:token", token);

      api.defaults.headers.common["authorization"] = `Bearer ${token}`;
      setData({ user, token });
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possível entrar");
      }
    }
  }

  function signOut() {
    localStorage.removeItem("@rocketnotes:token");
    localStorage.removeItem("@rocketnotes:user");

    setData({});
  }

  async function updateProfile({ user, avatarFile }) {
    try {
      if (avatarFile) {
        const fileUploadForm = new FormData();
        fileUploadForm.append("avatar", avatarFile);

        const response = await api.patch("/users/avatar", fileUploadForm);
        user.avatar = response.data.avatar;
      }

      await api.put("/users", user);
      //armazenar os dados em string
      localStorage.setItem("@rocketnotes:user", JSON.stringify(user));
      setData({ user, token: data.token });
      alert("Perfil atualizado!");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possível atualizar o perfil");
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("@rocketnotes:token");
    const user = localStorage.getItem("@rocketnotes:user");

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      //voltar o arquivo para json
      setData({ token, user: JSON.parse(user) });
    }
  }, []);
  /* useEffect:
  Tem 2 partes:
  1- Arrow function: o quer que vc quer que ele executa.
  2- vetor[]: pode-se colocar estados dentro mais toda vez que o estado mudar ele será disparado novamente*/

  return (
    <AuthContext.Provider
      value={{ signIn, user: data.user, updateProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
