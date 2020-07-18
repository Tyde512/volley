import { Request, Response } from "express";
import firebase from "firebase";
import JwtDecode from "jwt-decode";
import encrypt from "../utils/encrypt";
import { client } from "../..";
import { MessageEmbed } from "discord.js";

class UserController {
  fetch(req: Request, res: Response) {
    let authorization: any = req.headers["authorization"];
    let user: any = JwtDecode(authorization);

    firebase
      .database()
      .ref(`/users/${encrypt(user.nickname)}`)
      .once("value")
      .then((snap) => {
        if (snap.val() && snap.val().userid === user.uid) {
          res.json({
            nickname: snap.val().name,
            adminLevel: snap.val().adminLevel,
            stats: snap.val().status,
            vip: snap.val().vip,
          });
        }
      });
  }

  createRecoveryCode(req: Request, res: Response) {
    let user: any = req.body;
    let code = Math.round(Math.random() * 999999);

    if (user) {
      let discordUser = client.guilds.cache
        .get("695317119218221098")
        ?.members.cache.find((u) => u.user.tag === user.discordTag);

      let embed = new MessageEmbed()
        .setTitle("Parece que você pediu um código de recuperação.")
        .setDescription(`Aqui está ele: \`${code}\``);

      discordUser?.send(embed);

      firebase
        .database()
        .ref(`users/${encrypt(user.haxballUser)}`)
        .once("value")
        .then((snap) => {
          if (snap.val()) {
            if (
              snap.val().discord_id &&
              snap.val().discord_id != discordUser?.id
            )
              return res.status(401).json({ message: "Não autorizado." });
            firebase
              .database()
              .ref(`users/${encrypt(user.haxballUser)}`)
              .update({
                recoveryCode: code,
                discord_id: discordUser?.id,
              });

            res.json({ message: "Sucesso" });
          } else {
            res.status(401).json({ message: "Não autorizado" });
          }
        });
    }
  }

  verifyCode(req: Request, res: Response) {
    let { haxballUser, code } = req.body;

    if (haxballUser && code) {
      firebase
        .database()
        .ref(`users/${encrypt(haxballUser)}`)
        .once("value")
        .then((snap) => {
          if (snap.val() && snap.val().recoveryCode === parseInt(code)) {
            res.json({ message: "Sucesso" });
          } else {
            res.status(401).json({ message: "Código incorreto" });
          }
        });
    }
  }

  changePassword(req: Request, res: Response) {
    let { discordTag, haxballUser, code, password } = req.body;

    firebase
      .database()
      .ref(`users/${encrypt(haxballUser)}`)
      .once("value")
      .then((snap) => {
        if (snap.val() && snap.val().recoveryCode === parseInt(code)) {
          firebase
            .database()
            .ref(`users/${encrypt(haxballUser)}`)
            .update({
              recoveryCode: null,
              pass: password,
            });
          res.json({ message: "Sucesso" });
        } else {
          res.status(401).json({ message: "Não autorizado" });
        }
      });
  }

  userExists(req: any, res: Response) {
    let user: any = JSON.parse(req.headers["authorization"]);

    if (user) {
      let discordUser = client.guilds.cache
        .get("695317119218221098")
        ?.members.cache.find((u) => u.user.tag === user.tag);

      firebase
        .database()
        .ref(`users/${encrypt(user.haxballUser)}`)
        .once("value")
        .then((snap) => {
          if (
            snap.val() &&
            discordUser &&
            snap.val().discord_id === discordUser?.user.id
          ) {
            return res.json({ exists: true, user });
          } else {
            return res.status(401).json({ exists: false });
          }
        });
    }
  }
}

export default UserController;
