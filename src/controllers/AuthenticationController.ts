import { Request, Response } from "express";
import firebase from "firebase";
import jwt from "jsonwebtoken";
import { client } from "../..";
import encrypt from "../utils/encrypt";

class AuthenticationController {
  signUp(req: Request, res: Response) {
    let userb = req.body;

    if (!userb.nickname && !userb.discordTag && !userb.password)
      return res.json({ message: "Está faltando detalhes." });
    let discordUser: any = client.guilds.cache
      .get("695317119218221098")
      ?.members.cache.find((user) => user.user.tag === userb.discordTag);

    if (!discordUser)
      return res.status(401).json({
        message:
          "Usuário do Discord inválido, ou <a href='https://discord.gg/j8pYhA' style='color: white'>você não está conectado em nosso servidor.</a>",
      });

    firebase
      .database()
      .ref(`users/${encrypt(userb.nickname)}`)
      .once("value")
      .then((snap) => {
        if (snap.exists()) {
          return res
            .status(401)
            .json({ message: "Este usuário já está cadastrado." });
        } else {
          discordUser?.roles.add("727994567462354974");
          discordUser?.send("Você foi registrado no CV3D com sucesso.");
          discordUser?.send(
            `Use !${userb.password} em nossas salas para logar.`
          );
          firebase
            .database()
            .ref(`users/${encrypt(userb.nickname)}`)
            .set({
              auth: [],
              conn: [],
              userid: Math.round(Math.random() * 2000000),
              name: userb.nickname,
              pass: userb.password,
              discord_id: discordUser?.id,
              adminLevel: 0,
              vip: false,
              status: {
                elo: 0,
                cortes: 0,
                levantamentos: 0,
                contras: 0,
                bloqueios: 0,
                vSeguidas: 0,
                vitorias: 0,
                derrotas: 0,
              },
            });

          res.json({
            message: "Sucesso",
          });
        }
      });
  }
  signIn(req: Request, res: Response) {
    let user = req.body;

    if (!user.nickname && !user.password) {
      return res.json({ message: "Está faltando detalhes." });
    }

    firebase
      .database()
      .ref(`users/${encrypt(user.nickname)}`)
      .once("value")
      .then((snap) => {
        if (snap.val() && snap.val().pass === user.password) {
          res.setHeader(
            "Authorization",
            jwt.sign(
              {
                nickname: snap.val().name,
                stats: snap.val().status,
                vip: snap.val().vip,
                auth: snap.val().auth,
                conn: snap.val().conn,
                uid: snap.val().userid,
              },
              "shhh"
            )
          );
          res.json({ message: "Sucesso" });
        } else {
          res.status(401).json({ message: "Usuário inválido." });
        }
      });
  }
}

export default AuthenticationController;
