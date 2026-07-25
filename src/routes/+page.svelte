<script lang="ts">
  import { base } from '$app/paths';
  import { article } from '$lib/article';
  import { typoAction } from '$lib/typo';
  import Navbar from '$lib/Navbar.svelte';
  import Hero from '$lib/Hero.svelte';
  import Intro from '$lib/Intro.svelte';
  import DuoImages from '$lib/DuoImages.svelte';
  import Figure from '$lib/Figure.svelte';
  import HorizontalGallery from '$lib/HorizontalGallery.svelte';
  import Separator from '$lib/Separator.svelte';
  import Signatures from '$lib/Signatures.svelte';
  import ScrollySection from '$lib/scrolly/ScrollySection.svelte';

  const heroCredits = [
    { label: 'Journaliste', value: article.journalists.join(', ') },
    { label: 'Conception web', value: article.developers.join(', ') },
    { label: 'Graphisme 3D', value: article.graphics.join(' avec ') }
  ];

  const discoverySteps = [
    "Le 4 novembre 1922, les ouvriers de Howard Carter l'informent à son arrivée sur le chantier d'une trouvaille exceptionnelle&nbsp;: la présence d'<mark><strong>une marche taillée dans le roc</strong></mark>.",
    "Le 24 novembre, Carter et son assistant descendent les quatorze marches déjà dégagées. Sur l'avant-dernière, Carter trouve plusieurs objets, probablement tombés lors d'un pillage, dont <mark><strong>un linteau</strong></mark> de bois sur lequel est inscrit le nom d'Akhénaton, le père de Toutankhamon.",
    "Avant de démanteler la première porte, Carter et Callender aperçoivent deux petits percements en haut à gauche&nbsp;: la tombe semble avoir déjà été ouverte précédemment.",
    "Une fois la porte démantelée le lendemain, ils font face à <mark><strong>un long corridor en pente</strong></mark>, alors entièrement comblé de calcaire. Ils y trouvent de nombreux objets tels que des vases fragmentaires ou des tessons.",
    "Après une journée de déblaiement, Carter et Callender, alors rejoints par Lord Carnavon et sa fille, arrivent à une deuxième porte scellée le 26 novembre. En passant sa chandelle dans le petit trou creusé dans l'angle supérieur gauche, Carter distingue&nbsp;: «&nbsp;<em><mark><strong>des choses merveilleuses&nbsp;!</strong></mark> D'étranges animaux, des statues, et de l'or</em>&nbsp;»",
    "Derrière cette porte, c'est la première pièce du tombeau du pharaon Toutankhamon, appelée <mark><strong>l'Antichambre</strong></mark>."
  ];

  const chamberSteps = [
    "Sur le mur ouest de l'Antichambre, Carter découvre <mark><strong>une petite ouverture béante</strong></mark>, signe d'une effraction ancienne.",
    "En jetant un coup d'oeil à travers, il constate que la petite pièce — qu'il appellera <mark><strong>l'Annexe</strong></mark> — est «&nbsp;<em>une confusion totale de lits, de chaises, de boîtes, de vases d'albâtre et de faïences, de statuettes, de boîtes de forme particulière</em>&nbsp;».",
    "Carter et ses compagnons vont ensuite s'intéresser à un autre mur et découvrir de l'autre côté ce qu'ils espéraient tous&nbsp;: <mark><strong>les sarcophages du roi</strong></mark>. Seuls Carter, Carnarvon et Lady Evelyn ont pu entrer dans cette pièce à ce moment-là.",
    "Au centre, repose le tombeau composé — on l'apprendra plus tard — de quatre coffres-chapelles emboités les uns dans les autres."
  ];

  const treasureSlides = [
    {
      src: `${base}/pics/horiz1.jpg`,
      width: 560,
      height: 480,
      alt: "Représentation des douze heures de la nuit avec douze babouins, sur un mur de la chambre funéraire.",
      caption:
        "Dimitri Laboury&nbsp;: «&nbsp;<em>C'est une représentation des 12 heures de la nuit avec douze babouins qui représentent ce que le roi va devoir traverser pendant la nuit pour rejoindre le dieu Osiris et s'associer aux dieux éternellement.</em>&nbsp;» — Griffith Institute"
    },
    {
      src: `${base}/pics/horiz2.jpg`,
      width: 559,
      height: 474,
      alt: "Peinture montrant Ay, successeur de Toutankhamon, pratiquant le rite d'Ouverture de la bouche sur la momie.",
      caption:
        "Dimitri Laboury&nbsp;: «&nbsp;<em>Cette peinture est une scène absolument unique. On y voit le successeur de Toutankhamon, Ay sous l'apparence du Dieu Osiris, en train de faire les derniers rites sur la momie, qu'on appelle en égyptien le rite d'Ouverture de la bouche.</em>&nbsp;» — Griffith Institute"
    },
    {
      src: `${base}/pics/horiz3.jpg`,
      width: 640,
      height: 478,
      alt: "Une rangée de coffres au centre du Trésor.",
      caption:
        "Une rangée de coffres au centre du Trésor qui contenait entre autres des boucles d'oreilles, des sandales et un modèle en cire d'un héron. Au fond, le coffre à canope contenait l'estomac, les intestins, le foie et les poumons du roi enveloppés de lin dans des cercueils miniatures en or. — Griffith Institute"
    },
    {
      src: `${base}/pics/horiz4.jpg`,
      width: 640,
      height: 479,
      alt: "Des objets, dont de nombreuses maquettes de bateaux empilés contre le mur sud du Trésor.",
      caption:
        "Des objets, dont de nombreuses maquettes de bateaux empilés contre le mur sud du Trésor. — Griffith Institute"
    },
    {
      src: `${base}/pics/horiz5.jpg`,
      width: 560,
      height: 480,
      alt: "Statuettes de Geb, Sakhmet, Kebehsenuf et Duamutef.",
      caption:
        "Statuettes de Geb, Sakhmet, Kebehsenuf et Duamutef provenant de l'intérieur de sanctuaires noirs en bois trouvés contre le mur ouest du Trésor. — Griffith Institute"
    }
  ];
</script>

<svelte:head>
  <title>{article.title}</title>
  <meta name="description" content={article.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={article.url} />
  <meta property="og:title" content={article.title} />
  <meta property="og:description" content={article.description} />
  <meta property="og:image" content={article.image} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={article.title} />
  <meta name="twitter:description" content={article.description} />
  <meta name="twitter:image" content={article.image} />
  <link rel="canonical" href={article.url} />
</svelte:head>

<Navbar url={article.url} />

<Hero
  title={article.title}
  description={article.description}
  image={`${base}/pics/header_hero.jpg`}
  imageCredit="Getty Images"
  credits={heroCredits}
/>

<Intro>
  <p class="first-paragraph">
    <strong><em>Je vois des choses merveilleuses</em>&nbsp;».</strong>
    C'est par ces mots que, le 26 novembre 1922, l'archéologue britannique, Howard Carter
    exprima son intense émotion devant le spectacle qui s'offrait à ses yeux. Il se trouve
    alors devant l'Antichambre, la première pièce du tombeau du pharaon Toutankhamon, l'une
    des découvertes les plus connues et remarquables de l'Egypte antique.
  </p>

  <p>
    C'est l'aboutissement de plus de six ans de recherches menées par Howard Carter et
    financées par son richissime mécène, Lord Carnarvon, avec lequel il a sillonné la Vallée
    des Rois pendant des années, voguant de sites en sites, jusqu'à cet après-midi de
    novembre.
  </p>

  <p>
    Cent ans plus tard, retour sur un épisode majeur de l'archéologie en compagnie de Dimitry
    Laboury, directeur du service d'histoire de l'art et archéologie de l'Égypte pharaonique
    à l'Université de Liège.
  </p>
</Intro>

<figure class="map">
  <img src={`${base}/pics/map.png`} alt="Plan du tombeau de Toutankhamon" width="976" height="980" />
</figure>

<ScrollySection
  src={`${base}/pics/output.mp4`}
  poster={`${base}/pics/poster1.jpg`}
  steps={discoverySteps}
/>

<div class="article" use:typoAction>
  <p>
    Si, selon l'histoire officielle racontée par Carter, le convoi ne s'est pas introduit dans
    l'Antichambre ce 26 novembre pour attendre l'ouverture officielle du tombeau le 16 février
    1923, ce n'est pas l'avis de nombreux égyptologues, dont Thomas Hoving. Selon eux, les
    quatre explorateurs auraient poursuivi leurs recherches avant le départ d'Egypte de la
    fille de Lord Carnavon, Lady Evelyn, le 2 décembre 1922, frôlant ainsi avec l'illégalité.
  </p>

  <blockquote>
    <p>
      La tombe qu'il recherchait depuis tant d'années était bien celle dont il arpentait
      maintenant l'Antichambre
    </p>
  </blockquote>

  <p>
    Marc Gabolde, égyptologue et spécialiste de Toutankhamon, décrit ainsi les évènements qui
    ont suivi l'ouverture de l'Antichambre : « Les quatre protagonistes examinèrent le contenu
    de cette pièce et Carter eut la satisfaction de constater que la plupart des objets
    portaient le nom de Toutankhamon. La tombe qu'il recherchait depuis tant d'années était
    bien celle dont il arpentait maintenant l'Antichambre ». Ils avaient déjà eu un premier
    indice avec le linteau de bois découvert le 24 novembre, sur la marche du premier escalier.
    Probablement tombé lors d'un pillage, ce linteau comportait les inscriptions en hiéroglyphe
    des noms d'Akhénaton, le père et prédécesseur de Toutankhamon, et de son successeur
    féminin, a priori Méritaton sa sœur aînée. « Howard Carter comprend alors qu'il est dans la
    bonne période. Il est à peu près certain d'être devant la tombe de Toutankhamon, mais il ne
    sait pas quel est son état de conservation », complète Dimitry Laboury.
  </p>

  <p>
    Une fois dans l'Antichambre, la surprise est donc d'autant plus grande, que l'état de
    conservation et la richesse des objets entreposés dépasse ce qu'aucun archéologue n'avait
    découvert jusqu'alors. Parmi les objets les plus intéressants d'un point de vue historique
    retrouvés dans l'Antichambre figurent les chars en pièces détachées. En effet, « on sait
    que dans les tombes royales de l'époque de Toutankhamon, le lieu d'inhumation du roi est
    précédé d'une salle qui s'appelle en égyptien la salle du char, ajoute Dimitri Laboury.
    Dans cette tombe-là, cette salle est probablement conçue comme la salle du char, mais étant
    donné qu'elle est trop petite, on a mis le char en pièces démontées au lieu de mettre un
    vrai grand char en pleine proportion ».
  </p>
</div>

<Figure
  src={`${base}/pics/char.jpg`}
  alt="Des pièces de char entreposées dans l'Antichambre du tombeau"
  width={1092}
  height={629}
  caption="Des pièces entreposées dans l'Antichambre du tombeau — Griffith Institute, University of Oxford"
/>

<div class="article" use:typoAction>
  <h2>Une tombe plus petite que la plupart des tombes royales</h2>
  <Separator />

  <p>
    Comme son nom ne l'indique pas forcément, la Vallée des Rois ne comporte pas uniquement les
    tombes de pharaons, mais aussi celles de particuliers. La tombe de Toutankhamon est l'une
    d'entre elles. D'environ 100 mètres carré, elle fait figure d'exception parmi les
    gigantesques tombes royales. Elle a été « aménagée à la va-vite, en adaptant une tombe qui
    existait déjà - probablement destinée à un membre de l'élite proche du roi - le temps de la
    momification du souverain, c'est-à-dire environ 60 jours », explique Dimitri Laboury.
  </p>

  <blockquote>
    <p>Toutankhamon, un roi passé sous les radars</p>
  </blockquote>

  <p>
    On remarque notamment des champignons sur les peintures qui n'étaient probablement pas
    sèches au moment de la fermeture du tombeau. Cette précipitation s'explique par le fait que
    la mort de Toutankhamon n'était absolument pas prévue. Ce dernier est mort environ 10 ans
    après le début de son arrivée sur le trône, soit aux alentours de 17 ans. Cette funeste fin
    de règne est à l'image de son héritage.
  </p>

  <p>
    « Toutankhamon est un roi qui était passé sous les radars de l'égyptologie parce qu'il est
    lié à l'épisode du règne de son père, Akhénaton », enchaîne Dimitri Laboury. Le règne de
    celui-ci est marqué par plusieurs épisodes dramatiques dans l'histoire égyptienne. Tandis
    que le royaume subit une défaite militaire au Proche-Orient et est frappée d'une double
    épidémie de peste et de choléra, Akhénaton va opérer une profonde réforme religieuse qui
    sera très mal reçue par son peuple. « Il est présenté comme le précurseur du monothéisme,
    en raison de la monolâtrie qu'il imposa durant son règne au profit du dieu Aton, la
    divinité protectrice et garante de son autorité », écrit l'égyptologue de l'ULiège dans
    l'ouvrage collectif « Toutankhamon, à la découverte du pharaon oublié ».
  </p>

  <p>
    A sa mort, Akhénaton est donc « rejeté dans les oubliettes de l'histoire », tout comme sa
    fille Méritaton qui lui succèdera, même si cette dernière tentera d'initier un mouvement de
    retour à la tradition polythéiste. Le règne de Méritaton sera bref et c'est son jeune
    frère, Toutankhamon, alors âgé de neuf ans, qui devient pharaon. La principale action de
    son règne est la poursuite du retour au polythéisme mais il meurt prématurément,
    probablement de maladie, avant d'avoir atteint ses vingt ans. Il sera donc enterré dans une
    tombe manifestement préparée à la hâte.
  </p>

  <p>Mais poursuivons notre exploration...</p>
</div>

<ScrollySection
  src={`${base}/pics/output2.mp4`}
  poster={`${base}/pics/poster2.jpg`}
  steps={chamberSteps}
/>

<div class="article" use:typoAction>
  <p>
    « Callender était trop corpulent pour passer et a dû faire le guet », précise Dimitri
    Laboury. La salle où se trouve la dépouille du pharaon, appelée « salle de l'or en égyptien
    » porte bien son nom. A juste titre : plusieurs chapelles en bois doré entourent le
    sarcophage central et les trois cercueils du roi, lui-même momifié avec de nombreuses
    bandelettes de tissu. Il aura fallu attendre 1925 pour que l'ensemble de ces éléments
    soient ouverts et étudiés par l'équipe d'Howard Carter.
  </p>
</div>

<DuoImages
  images={[
    {
      src: `${base}/pics/tut-7.jpg`,
      alt: "L'ouverture du sarcophage de Toutankhamon",
      width: 1200,
      height: 892
    },
    {
      src: `${base}/pics/tut-19.jpg`,
      alt: 'Le masque funéraire de Toutankhamon',
      width: 1200,
      height: 1680
    }
  ]}
  caption="Même si la tombe a été découverte en 1922, il a fallu attendre octobre 1925 pour que le sarcophage soit ouvert, laissant apparaitre le masque funéraire de Toutankhamon — Griffith Institute, University of Oxford"
/>

<div class="article" use:typoAction>
  <h2>La momie de Toutankhamon</h2>
  <Separator />

  <p>
    La dépouille de Toutankhamon n'a pas échappé aux rites funéraires de l'ancienne Egypte.
    Après sa mort, le pharaon fut entièrement rasé avant que lui soient retirés son cerveau et
    ses viscères. Son corps est ensuite entouré et rempli de sachets de natron (un sel utilisé
    pour dessécher le corps) pendant environ septante jours.
  </p>

  <p>
    Avant de procéder à l'emmaillotage, la dépouille est parée de bijoux, chacun des doigts de
    mains et de pieds sont encapuchonnés d'un étui d'or. Sur sa tête, un bonnet ras, avec un
    motif en perles de faïences multicolores était fixé. « Il y a une forte probabilité pour
    que ce couvre-chef, dont l'inscription remonte à peu de temps avant la naissance du roi,
    soit en fait le premier objet placé sur la tête du prince lorsqu'il naquit », écrit Marc
    Gabolde.
  </p>

  <p>
    L'emmaillotage suit un ordre strict. Carter a dénombré plus de seize niveaux de
    bandelettes, entre chacun desquels ont été disposés plus de 200 amulettes et objets
    funéraires. Parmi ceux-ci figurent deux poignards, dont l'un des deux dispose d'une lame en
    fer, métal dont l'usage était extrêmement inhabituel à l'époque du pharaon.
  </p>

  <p>
    Une fois l'emmaillotage terminé, d'autres parures funéraires en or furent disposées sur la
    momie dont le fameux masque funéraire en or de près de 11 kilos composé de plus de 1200
    pièces.
  </p>
</div>

<Figure
  src={`${base}/pics/masque.jpg`}
  mobileSrc={`${base}/pics/masque_mobile.jpg`}
  alt="Le masque funéraire de Toutankhamon"
  width={1024}
  height={682}
  caption="Le masque de Toutankhamon, dévoilé en 1925. Lourd de 10,35 kg d'or et de pierres semi-précieuses, c'est un véritable chef-d'oeuvre de l'art égyptien. — Getty Images"
/>

<div class="article" use:typoAction>
  <p>
    Les objets retrouvés ont aussi permis de faire des avancées majeures dans la connaissance
    de la botanique et de la viticulture de l'époque. Ainsi, les colliers de fleurs que
    Toutankhamon portait forment la première collection botanique de l'histoire. Selon Dimitri
    Laboury, « ils ont permis de comprendre toute l'industrie florale qui était très importante
    dans l'Égypte ancienne et dont on n'a pratiquement aucune trace textuelle ».
  </p>

  <p>
    De la même manière, les trois jarres retrouvées près de la dépouille du roi ont donné des
    informations sur la date des vins qu'elles contenaient : environ 30 ans d'âge. « Cette
    découverte montre que les Égyptiens gardaient du vin, soit parce qu'il est associé à une
    date particulière, soit pour le conserver », détaille Dimitri Laboury.
  </p>

  <p>
    La momie n'a pas été bien conservée mais elle a quand même pu raconter une nouvelle
    histoire en 2010 à la suite d'analyses génétiques qui « révèlent une densité génétique
    absolument anormale dès la génération du grand-père de Toutankhamon », indique Dimitri
    Laboury.
  </p>
</div>

<DuoImages
  images={[
    {
      src: `${base}/pics/floral.jpg`,
      width: 1200,
      height: 982,
      caption:
        "Ces colliers de fleurs forment la première collection botanique de l'histoire retrouvée in situ. — Met Museum"
    },
    {
      src: `${base}/pics/jarre.jpg`,
      width: 357,
      height: 480,
      caption: 'Trois jarres de vin. — Griffith Institute, University of Oxford'
    }
  ]}
/>

<div class="article" use:typoAction>
  <p>
    Si certaines des conclusions étaient attendues : Toutankhamon était bien le fils
    d'Akhénaton, d'autres l'étaient beaucoup moins. Ainsi, comme le raconte Marc Gabolde dans
    son article « Les chromosomes de Toutankhamon » dans l'ouvrage collectif « Toutankhamon, à
    la découverte du pharaon oublié » : la mère de Toutankhamon serait une mystérieuse
    <em>Young Lady</em>, très probablement Néfertiti, également la cousine germaine
    d'Akhénaton.
  </p>

  <p>
    « Bien entendu, ces résultats sont encore provisoires et susceptibles d'être contredits par
    de nouvelles inscriptions ou de nouvelles analyses génétiques. Ceci invite à rester prudent
    sur les identifications proposées et à tempérer la confiance que l'on doit accorder à ces
    nouvelles méthodes, tout en encourageant la poursuite des investigations », conclut le
    chercheur.
  </p>

  <p>
    La chambre funéraire est la seule pièce du tombeau à être décorée de peintures à la
    détrempe. A côté de cette pièce, Carter et son équipe ont découvert une dernière petite
    salle que l'on appelle la salle du Trésor. Elle contient parmi les objets les plus précieux
    du tombeau.
  </p>
</div>

<HorizontalGallery slides={treasureSlides} />

<div class="article" use:typoAction>
  <h2>Malédiction et visite royale belge</h2>
  <Separator />

  <p>
    Six mois après la découverte des premières marches de l'escalier menant à la tombe de
    Toutankhamon, Lord Carnarvon, le fameux mécène de Howard Carter, décède brutalement. Cette
    mort mystérieuse va très vite alimenter rumeurs et autres spéculations : le richissime
    aristocrate anglais aurait été frappé par la malédiction de Toutankhamon. Il ne serait que
    le premier de la longue liste des victimes qui sont mortes étrangement après avoir visité
    le tombeau du célèbre pharaon.
  </p>

  <p>
    Pourtant, l'historien Marc Gabolde a calculé la moyenne d'âge des personnes, soi-disant
    frappées par cette malédiction : 52,42 ans, soit l'espérance de vie moyenne pour les hommes
    à cette époque-là. Par ailleurs, dix ans après la découverte de la tombe, tous les
    participants à cette aventure, hormis, Lord Carnavon étaient toujours vivants.
  </p>

  <p>
    Finalement, si cette malédiction n'est absolument pas fondée scientifiquement, elle a eu le
    mérite de booster l'intérêt des historiens, collectionneurs et antiquaires sur l'Egypte
    antique (parfois à des fins purement spéculatives).
  </p>
</div>

<Figure
  src={`${base}/pics/el_2.jpg`}
  alt="La reine Elisabeth et l'égyptologue belge Jean Capart en visite au tombeau de Toutankamon, le 18 février 1923"
  width={843}
  height={466}
  caption="La reine Elisabeth et l'égyptologue belge Jean Capart en visite au tombeau de Toutankamon, le 18 février 1923 — Archives du Palais royal"
/>

<div class="article" use:typoAction>
  <p>
    La reine Elizabeth de Belgique est l'une d'entre eux. Elle se rendra en février 1923 puis
    en mars 1930 dans la tombe de Toutankhamon. Certains avancent qu'elle aurait reçu certains
    objets du sarcophage dont un petit fragment du vélum de lin intercalé entre deux chapelles
    funéraires. Objet qu'elle rendra finalement au musée du Cinquantenaire en 1951.
  </p>

  <p>
    Lors de la découverte du tombeau, la presse parle de « Tut-mania », les écrivains
    s'emparent du sujet, des films ou pièces de théâtre sont produits, et des expositions se
    multiplient sur le célèbre pharaon.
  </p>

  <p>
    Un siècle plus tard, le pharaon n'a ni perdu de sa notoriété ni de sa superbe. Désormais,
    c'est dans le nouveau GEM Grand Musée Egyptien, inauguré cet automne, que ses objets
    connaitront leur dernière demeure, cent ans après leur premier transfert de la Vallée des
    rois jusqu'au Caire.
  </p>

  <Separator />

  <div class="sources">
    Références :
    <ul>
      <li>
        <a
          href="https://www.osirisnet.net/tombes/pharaons/toutankhamon/toutankhamon_01.htm"
          rel="noreferrer"
          target="_blank">Osiris.net - tombes de l'Egypte antique</a
        >
      </li>
      <li>
        Simon Connor et Dimitri Laboury, Toutankhamon : A la découverte du pharaon oublié,
        Presses Universitaires de Liège, 2020.
      </li>
      <li>Marc Gabolde, Toutankhamon, Pygmalion, 2015.</li>
    </ul>
  </div>
</div>

<Signatures
  credits={[
    { label: 'Journaliste', names: article.journalists },
    { label: 'Conception web', names: article.developers },
    { label: 'Graphisme 3D', names: article.graphics }
  ]}
/>

<style>
  .map {
    display: block;
    margin: var(--section-gap) auto;
    width: 40%;
    max-width: 100%;
  }

  @media (max-width: 800px) {
    .map {
      width: 80%;
    }
  }

  @media (max-width: 500px) {
    .map {
      width: 100%;
      padding: 0 1em;
    }
  }

  .sources {
    font-size: 0.8em;
    line-height: 1.4;
    color: var(--color-muted);
    margin-top: 2rem;
  }

  .sources ul {
    padding-left: 1.2em;
  }

  .sources li {
    margin-bottom: 0.4em;
  }
</style>
