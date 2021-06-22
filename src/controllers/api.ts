import express from "express";
import BaseRoute from "./baseRoute";
import User from "./user";
import Card from "./card";
import Log from "./log";

export default class Api extends BaseRoute {
    public static path = '';
    private static instance: Api;
    public app: express.Application;

    private constructor () {
        super();
        this.init();
    }

    static get router (): express.Router {
        if (!Api.instance) {
          Api.instance = new Api();
        }
        return Api.instance.router;
    }

    private init () {
      this.router.use(User.path, User.router);
      this.router.use(Card.path, Card.router);
      this.router.use(Log.path, Log.router);
	}
}