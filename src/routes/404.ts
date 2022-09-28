import { Router, Request, Response } from 'express';

const router = Router();

router.route('*').all((req: Request, res: Response) => {
	res.status(404).send(
		`<h1>Oops! Looks like we got a 404 error.</h1>
    <h3>This route cannot be reached, check the url and try again.</h3>
    <style>
      body {
        font-family: Inter, Helvetica,'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.8rem;
        background-color: cornsilk;
        display: grid;
        place-content: center;
        place-items: center;
      }
      h1 {
        color: tomato;
      }
    </style>
      `
	);
});

export { router as error404Route };
