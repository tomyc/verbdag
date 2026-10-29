// Baza czasowników opracowana na podstawie lekcji 1–42 (głównie: lekcja 18 – lista
// czasowników nieregularnych, tabela grup 1–4 czasowników regularnych, lekcje 19–22).
//
// Format wiersza: infinitive | presens | preteritum | perfektum partisipp | PL | dopełnienie | grupa | lekcja
//   - formy alternatywne rozdzielone "/" (pierwsza = podstawowa), np. "dro/drog"
//   - dopełnienie służy do generowania zdań; "-" = brak zdania z luką dla tego czasownika
//   - grupa: 1 (-et), 2 (-te/-t), 3 (-de/-d), 4 (-dde/-dd), S (nieregularny), M (modalny)

const RAW = `
være|er|var|vært|być|hjemme|S|1
ha|har|hadde|hatt|mieć|en ny bil|S|3
gå|går|gikk|gått|iść|på kino|S|1
gjøre|gjør|gjorde|gjort|robić|lekser|S|1
komme|kommer|kom|kommet|przychodzić|hjem sent|S|8
få|får|fikk|fått|dostawać|en gave|S|10
se|ser|så|sett|widzieć, oglądać|en film|S|4
si|sier|sa|sagt|powiedzieć|ingenting|S|4
ta|tar|tok|tatt|brać|bussen|S|7
gi|gir|ga/gav|gitt|dawać|en gave til mora si|S|1
sove|sover|sov|sovet|spać|lenge|S|7
drikke|drikker|drakk|drukket|pić|kaffe|S|1
synge|synger|sang|sunget|śpiewać|en norsk sang|S|18
finne|finner|fant|funnet|znaleźć|nøklene|S|18
bli|blir|ble|blitt|stawać się, zostać|hjemme|S|17
dra|drar|dro/drog|dratt|jechać|til Bergen|S|8
skrive|skriver|skrev|skrevet|pisać|en melding|S|18
lese|leser|leste|lest|czytać|ei bok|2|5
spørre|spør|spurte|spurt|pytać|læreren|S|12
vite|vet|visste|visst|wiedzieć|svaret|S|11
forstå|forstår|forsto/forstod|forstått|rozumieć|oppgaven|S|2
fortelle|forteller|fortalte|fortalt|opowiadać|en historie|S|22
hjelpe|hjelper|hjalp|hjulpet|pomagać|broren min|S|10
legge|legger|la|lagt|kłaść|boka på bordet|S|4
ligge|ligger|lå|ligget|leżeć|på sofaen|S|23
sitte|sitter|satt|sittet|siedzieć|ved vinduet|S|4
sette|setter|satte|satt|stawiać, kłaść|koppen på bordet|S|18
stå|står|sto/stod|stått|stać|ved døra|S|18
løpe|løper|løp|løpt|biegać|i parken|S|10
selge|selger|solgte|solgt|sprzedawać|bilen sin|S|18
velge|velger|valgte|valgt|wybierać|en ny jakke|S|36
treffe|treffer|traff|truffet|spotykać|vennene sine|S|33
vinne|vinner|vant|vunnet|wygrywać|kampen|S|20
slå|slår|slo|slått|uderzać, bić|ballen|S|32
falle|faller|falt|falt|upadać|på isen|S|18
fryse|fryser|frøs|frosset|marznąć|ute|S|18
fly|flyr|fløy|fløyet|latać|til Oslo|S|18
gråte|gråter|gråt|grått|płakać|-|S|18
le|ler|lo|ledd|śmiać się|av vitsen|S|18
la|lar|lot|latt|pozwalać|-|S|18
hete|heter|het|hett|nazywać się|-|S|1
be|ber|ba/bad|bedt|prosić|om hjelp|S|18
bite|biter|bet|bitt|gryźć|i et eple|S|18
brenne|brenner|brant|brent|palić się|-|S|10
bringe|bringer|brakte|brakt|przynosić|mat|S|18
forlate|forlater|forlot|forlatt|opuszczać|byen|S|18
fortsette|fortsetter|fortsatte|fortsatt|kontynuować|å lese|S|47
forsvinne|forsvinner|forsvant|forsvunnet|znikać|-|S|18
gjelde|gjelder|gjaldt|gjeldt|obowiązywać|-|S|18
lyve|lyver|løy|løyet|kłamać|-|S|18
møte|møter|møtte|møtt|spotykać|nye venner|2|20
nyse|nyser|nøs|nyst|kichać|-|S|18
skjære|skjærer|skar|skåret|kroić|brødet|S|18
stjele|stjeler|stjal|stjålet|kraść|en sykkel|S|18
tvinge|tvinger|tvang|tvunget|zmuszać|-|S|18
bære|bærer|bar|båret|nieść|ut søpla|S|32
beskrive|beskriver|beskrev|beskrevet|opisywać|bildet|S|45
planlegge|planlegger|planla|planlagt|planować|ferien|S|38
snakke|snakker|snakket|snakket|mówić|norsk|1|2
kaste|kaster|kastet|kastet|rzucać|ballen|1|36
huske|husker|husket|husket|pamiętać|ordene|1|38
sykle|sykler|syklet|syklet|jeździć rowerem|hjem|1|8
bade|bader|badet|badet|kąpać się|i havet|1|38
arbeide|arbeider|arbeidet|arbeidet|pracować|i hagen|1|7
vaske|vasker|vasket|vasket|myć|gulvet|1|31
hente|henter|hentet|hentet|odbierać|barna|1|8
vente|venter|ventet|ventet|czekać|på bussen|1|8
pakke|pakker|pakket|pakket|pakować|kofferten|1|38
våkne|våkner|våknet|våknet|budzić się|tidlig|1|7
slutte|slutter|sluttet|sluttet|kończyć, przestawać|å røyke|1|10
savne|savner|savnet|savnet|tęsknić|familien min|1|22
miste|mister|mistet|mistet|gubić, tracić|nøklene|1|20
lukke|lukker|lukket|lukket|zamykać|døra|1|4
jogge|jogger|jogget|jogget|biegać (jogging)|i parken|1|36
fiske|fisker|fisket|fisket|łowić ryby|i sjøen|1|36
hate|hater|hatet|hatet|nienawidzić|mandager|1|12
elske|elsker|elsket|elsket|kochać, uwielbiać|å reise|1|50
handle|handler|handlet|handlet|robić zakupy|mat|1|39
rydde|rydder|ryddet|ryddet|sprzątać|rommet|1|22
slappe av|slapper av|slappet av|slappet av|odpoczywać|-|1|9
dusje|dusjer|dusjet|dusjet|brać prysznic|-|1|41
puste|puster|pustet|pustet|oddychać|dypt|1|43
lete etter|leter etter|lette etter|lett etter|szukać|hunden min|2|22
bytte|bytter|byttet|byttet|zmieniać, wymieniać|tog|1|39
skifte|skifter|skiftet|skiftet|zmieniać|klær|1|31
lengte|lengter|lengtet|lengtet|tęsknić|hjem|1|22
spise|spiser|spiste|spist|jeść|middag|2|1
leke|leker|lekte|lekt|bawić się|i parken|2|20
kjøpe|kjøper|kjøpte|kjøpt|kupować|en ny kjole|2|7
spille|spiller|spilte|spilt|grać|gitar|2|16
glemme|glemmer|glemte|glemt|zapominać|nøklene|2|36
kjenne|kjenner|kjente|kjent|znać (kogoś)|naboen|2|41
sende|sender|sendte|sendt|wysyłać|en e-post|2|20
begynne|begynner|begynte|begynt|zaczynać|å jobbe|2|7
kjøre|kjører|kjørte|kjørt|jechać, prowadzić|bil|2|8
høre|hører|hørte|hørt|słyszeć, słuchać|på musikk|2|8
reise|reiser|reiste|reist|podróżować|til Norge|2|14
lære|lærer|lærte|lært|uczyć się|norsk|2|15
bruke|bruker|brukte|brukt|używać|telefonen|2|13
hilse|hilser|hilste|hilst|witać, pozdrawiać|på naboen|2|42
besøke|besøker|besøkte|besøkt|odwiedzać|besteforeldrene|2|41
låne|låner|lånte|lånt|pożyczać|ei bok|2|39
svare|svarer|svarte|svart|odpowiadać|på meldingen|2|33
bestille|bestiller|bestilte|bestilt|zamawiać|pizza|2|21
tjene|tjener|tjente|tjent|zarabiać|penger|2|16
røyke|røyker|røykte|røykt|palić papierosy|-|2|10
vise|viser|viste|vist|pokazywać|veien|2|32
stenge|stenger|stengte|stengt|zamykać (sklep)|butikken|2|48
bake|baker|bakte|bakt|piec|ei kake|2|49
like|liker|likte|likt|lubić|kaféen|2|21
trenge|trenger|trengte|trengt|potrzebować|en oppskrift|2|49
ringe|ringer|ringte|ringt|dzwonić|mora si|2|36
bestemme seg|bestemmer seg|bestemte seg|bestemt seg|decydować się|-|2|38
føle seg|føler seg|følte seg|følt seg|czuć się|trøtt|2|38
studere|studerer|studerte|studert|studiować|norsk|2|20
reparere|reparerer|reparerte|reparert|naprawiać|bilen min|2|16
trene|trener|trente|trent|trenować|etter jobb|2|7
vare|varer|varte|vart|trwać|-|2|49
lage|lager|lagde/laget|lagd/laget|przygotowywać, robić|middag|3|21
leve|lever|levde|levd|żyć|lenge|3|43
prøve|prøver|prøvde|prøvd|próbować|norsk mat|3|20
øve|øver|øvde|øvd|ćwiczyć|på uttalen|3|35
bygge|bygger|bygde|bygd|budować|en garasje|3|43
pleie|pleier|pleide|pleid|mieć zwyczaj|å lese|3|39
bo|bor|bodde|bodd|mieszkać|i Lublin|4|1
tro|tror|trodde|trodd|sądzić, wierzyć|det|4|22
kunne|kan|kunne|kunnet|móc, umieć|svaret|M|10
skulle|skal|skulle|skullet|mieć zamiar|-|M|7
ville|vil|ville|villet|chcieć|-|M|10
måtte|må|måtte|måttet|musieć|-|M|10
burde|bør|burde|burdet|powinien|-|M|11
`;

export const GROUPS = {
  1: { label: 'Gruppe 1', rule: 'temat na dwie spółgłoski lub -d → -et, har -et', short: '-et' },
  2: { label: 'Gruppe 2', rule: 'temat na jedną spółgłoskę, -ll/-mm/-nn/-ng/-nd, -ere → -te, har -t', short: '-te' },
  3: { label: 'Gruppe 3', rule: 'temat na -v, -g, -gg, -ei → -de, har -d', short: '-de' },
  4: { label: 'Gruppe 4', rule: 'jednosylabowe na samogłoskę → -dde, har -dd', short: '-dde' },
  S: { label: 'Sterkt', rule: 'nieregularny – formy trzeba zapamiętać', short: 'nieregul.' },
  M: { label: 'Modalt', rule: 'czasownik modalny – po nim bezokolicznik bez å', short: 'modalny' },
};

export const VERBS = RAW.trim()
  .split('\n')
  .map((line) => {
    const [inf, pres, pret, perf, pl, obj, group, lesson] = line.split('|');
    return {
      id: inf,
      inf,
      pres,
      pret,
      perf,
      pl,
      obj: obj === '-' ? '' : obj,
      cloze: obj !== '-',
      group,
      lesson: Number(lesson),
    };
  });

export const VERB_BY_ID = Object.fromEntries(VERBS.map((v) => [v.id, v]));
