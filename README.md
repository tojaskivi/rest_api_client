# REST API - Klient

## Moment 5 - Webbutveckling III

Denna klient använder sig utav ett egenskapat REST API. Repo till APIt repo finns [här](https://github.com/toskivi/rest_api_api). Detta API visar universitetskurser som jag har läst. Vem som helst har möjlighet att söka efter kurser eller visa samtliga kurser. Inloggade användare har möjlighet att dessutom lägga till nya, ändra- och radera befintliga kurser.

## Utvecklingsmiljö

Detta projekt använder sig utav npm och gulp, så se till att detta är installerat först.

Först måste paketen hämtas, detta görs med kommandot `npm install`.

Sedan körs kommandot `gulp build`, för att bygga upp projektet från grunden för första gången. Efter denna kan man köra kommandot `gulp`, som startar en liveserver samt automatiskt flyttar/kompilera filer när de ändras.

## Framtida förbättringar

- Sidan kommer byggas om med TypeScript istället för JavaScript.
- All JS-kod kommer optimeras och förbättras.
- SASSen behöver ses över och förbättras

## Länkar

Klientsidan hittas [här](https://ojaskivi.se/rest_api/client/). Inloggningen är **D26A80**, med versaler.


REST APIet hittas [här](https://ojaskivi.se/rest_api/public/api/).

En minidokumentation över APIet och dess funktioner hittas i APIets [readme](https://github.com/toskivi/rest_api_api).

För att klona detta repo: `git clone https://github.com/toskivi/rest_api_client.git`

För att klona APIets repo: `git clone https://github.com/toskivi/rest_api_api.git`

---

Tommi Ojaskivi // DT193G // Webbutveckling III // MIUN
