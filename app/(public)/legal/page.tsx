import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Typography } from "@/components/ui/typography";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Consultez les mentions légales du site de l'association Temple Team pour en savoir plus sur nos conditions d'utilisation et les obligations légales à respecter.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default function Legal() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Mentions légales</LayoutTitle>
        <LayoutDescription>
          Consultez les mentions légales du site de l'association Temple Team
          pour en savoir plus sur nos conditions d'utilisation et les
          obligations légales à respecter.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="space-y-2 items-start">
        <Typography>
          Le présent site web, accessible à l'adresse{" "}
          <a href="https://templeteam.fr">https://www.templeteam.fr</a>, est
          édité par l'association <strong>Temple Team</strong> (loi 1901),
          domiciliée au Gymnase Pierre de Couvertin, 6 Rue George Sand 38500
          Voiron.
        </Typography>
        <Typography>
          Directeur de la publication : Mr. Benjamin BELLIER
        </Typography>
      </LayoutSection>
      <LayoutSection className="space-y-2 items-start">
        <Typography variant="h3">Conception et hébergement</Typography>
        <Typography>
          Le site web de l'association Temple Team a été conçu par Benjamin
          Bellier
          <br />
          Github:{" "}
          <a
            href="http://github.com/BennyBellier"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/BennyBellier
          </a>
          <br />
          Contact :{" "}
          <a href="mailto:benny.bellier@gmail.com">benny.bellier@gmail.com</a>
          <br />
          <br />
          L'hébergement du site web est assuré par :
          <br />
          <a
            href="https://www.o2switch.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="436"
              height="98"
              viewBox="0 0 436 98"
              fill="none"
              className="w-fit h-12 flex"
            >
              <g clip-path="url(#clip0_10_62)">
                <path
                  d="M29.1279 98C24.7119 98 20.7798 97.3345 17.3316 96.0037C13.8835 94.6729 10.9495 92.8278 8.52977 90.4685C6.17051 88.1092 4.35569 85.387 3.08532 82.3018C1.87544 79.2166 1.27051 75.9197 1.27051 72.4111V70.2333C1.27051 66.6037 1.90569 63.216 3.17606 60.0704C4.50692 56.9247 6.38224 54.1722 8.80199 51.8129C11.2217 49.4537 14.1557 47.6086 17.6038 46.2778C21.052 44.947 24.8934 44.2815 29.1279 44.2815C33.423 44.2815 37.2643 44.947 40.652 46.2778C44.1001 47.6086 47.0341 49.4537 49.4538 51.8129C51.8735 54.1722 53.7187 56.9247 54.989 60.0704C56.3198 63.216 56.9853 66.6037 56.9853 70.2333V72.4111C56.9853 75.9197 56.3501 79.2166 55.0798 82.3018C53.8698 85.387 52.055 88.1092 49.6353 90.4685C47.2761 92.8278 44.3724 94.6729 40.9242 96.0037C37.4761 97.3345 33.5439 98 29.1279 98ZM29.1279 84.2074C31.6687 84.2074 33.7557 83.6629 35.389 82.5741C37.0828 81.4852 38.3532 79.9729 39.2001 78.037C40.0471 76.0407 40.4705 73.8025 40.4705 71.3222C40.4705 68.721 40.0168 66.4525 39.1094 64.5166C38.2624 62.5204 36.9921 60.9475 35.2983 59.7981C33.6045 58.6488 31.5476 58.0741 29.1279 58.0741C26.7082 58.0741 24.6513 58.6488 22.9575 59.7981C21.2638 60.9475 19.9631 62.5204 19.0557 64.5166C18.2087 66.4525 17.7853 68.721 17.7853 71.3222C17.7853 73.8025 18.2087 76.0407 19.0557 78.037C19.9027 79.9729 21.173 81.4852 22.8668 82.5741C24.5606 83.6629 26.6476 84.2074 29.1279 84.2074ZM143.587 97.8185C136.327 97.8185 130.611 96.3363 126.437 93.3722C122.263 90.3474 120.024 86.1129 119.722 80.6685H134.24C134.482 82.1808 135.42 83.4815 137.053 84.5703C138.687 85.6592 140.985 86.2037 143.95 86.2037C146.067 86.2037 147.882 85.9012 149.394 85.2963C150.967 84.6308 151.753 83.5722 151.753 82.1204C151.753 80.85 151.148 79.8215 149.939 79.0352C148.729 78.1882 146.521 77.6136 143.314 77.3111L139.866 76.9481C133.454 76.2826 128.735 74.5284 125.711 71.6852C122.686 68.8419 121.174 65.2729 121.174 60.9778C121.174 57.2877 122.081 54.2629 123.896 51.9037C125.711 49.484 128.221 47.6692 131.427 46.4592C134.634 45.2493 138.294 44.6444 142.407 44.6444C149.122 44.6444 154.536 46.1266 158.65 49.0907C162.763 51.9944 164.941 56.1988 165.183 61.7037H150.664C150.423 60.1914 149.606 58.921 148.214 57.8926C146.823 56.8037 144.827 56.2592 142.226 56.2592C140.35 56.2592 138.808 56.5919 137.598 57.2574C136.448 57.9229 135.874 58.8604 135.874 60.0704C135.874 61.3407 136.418 62.2784 137.507 62.8833C138.657 63.4882 140.471 63.9419 142.951 64.2444L146.4 64.6074C152.812 65.2729 157.742 67.0574 161.19 69.9611C164.699 72.8044 166.453 76.5549 166.453 81.2129C166.453 84.6611 165.516 87.6252 163.64 90.1055C161.826 92.5858 159.194 94.4914 155.746 95.8222C152.358 97.153 148.305 97.8185 143.587 97.8185ZM193.735 96.1852L202.628 47.7296H219.869L230.032 96.1852H217.509L206.983 48.0926H214.606L204.987 96.1852H193.735ZM190.65 96.1852L190.559 82.3926H200.541L200.632 96.1852H190.65ZM182.574 96.1852L169.417 46.0963H185.569L197.728 96.1852H182.574ZM221.956 96.1852L222.046 82.3926H232.028L231.937 96.1852H221.956ZM225.948 96.1852L236.928 46.0963H251.991L240.013 96.1852H225.948ZM262.362 96.1852V46.0963H278.877V96.1852H262.362ZM256.011 58.0741V46.0963H278.877V58.0741H256.011ZM269.168 42.1037C266.143 42.1037 263.905 41.3475 262.453 39.8352C261.061 38.2623 260.366 36.266 260.366 33.8463C260.366 31.4265 261.061 29.4605 262.453 27.9481C263.905 26.3753 266.112 25.5889 269.077 25.5889C272.101 25.5889 274.309 26.3753 275.701 27.9481C277.092 29.4605 277.788 31.4265 277.788 33.8463C277.788 36.266 277.092 38.2623 275.701 39.8352C274.309 41.3475 272.132 42.1037 269.168 42.1037ZM314.883 96.9111C309.439 96.9111 305.083 96.2456 301.817 94.9148C298.61 93.584 296.281 91.3759 294.83 88.2907C293.378 85.2055 292.652 81.0315 292.652 75.7685L292.742 33.0296H307.987L307.896 76.2222C307.896 78.4604 308.47 80.1845 309.62 81.3944C310.829 82.5437 312.553 83.1185 314.792 83.1185H321.689V96.9111H314.883ZM285.392 58.0741V46.0963H321.689V58.0741H285.392ZM353.228 98C348.873 98 345.093 97.3044 341.886 95.9129C338.681 94.4611 335.988 92.5252 333.81 90.1055C331.694 87.6858 330.09 84.9333 329.001 81.8481C327.973 78.7629 327.458 75.5567 327.458 72.2296V70.4148C327.458 66.9062 328.003 63.5789 329.091 60.4333C330.242 57.2877 331.904 54.5049 334.082 52.0852C336.26 49.6655 338.953 47.7599 342.158 46.3685C345.365 44.9771 349.054 44.2815 353.228 44.2815C357.827 44.2815 361.88 45.1889 365.388 47.0037C368.898 48.8185 371.68 51.3289 373.736 54.5352C375.854 57.6808 377.033 61.3104 377.275 65.4241H361.123C360.941 63.4278 360.186 61.734 358.854 60.3426C357.584 58.9512 355.709 58.2555 353.228 58.2555C351.112 58.2555 349.357 58.8 347.965 59.8889C346.635 60.9778 345.637 62.49 344.971 64.4259C344.307 66.3618 343.973 68.6604 343.973 71.3222C343.973 73.8025 344.245 76.0104 344.79 77.9463C345.396 79.8821 346.363 81.3944 347.693 82.4833C349.085 83.5118 350.931 84.0259 353.228 84.0259C354.923 84.0259 356.344 83.7234 357.493 83.1185C358.644 82.5136 359.551 81.6666 360.215 80.5778C360.881 79.4284 361.304 78.0975 361.486 76.5852H377.638C377.396 80.8197 376.186 84.54 374.008 87.7463C371.892 90.9525 369.048 93.4629 365.478 95.2778C361.911 97.0926 357.827 98 353.228 98ZM386.011 96.1852V29.9444H402.526V67.6926H400.348C400.348 62.6111 400.983 58.3463 402.254 54.8981C403.524 51.45 405.37 48.8488 407.789 47.0944C410.27 45.34 413.324 44.4629 416.954 44.4629H417.68C423.124 44.4629 427.269 46.4289 430.111 50.3611C433.015 54.2933 434.467 60.0704 434.467 67.6926V96.1852H417.952V67.0574C417.952 64.7586 417.257 62.8833 415.865 61.4315C414.475 59.9192 412.629 59.1629 410.33 59.1629C408.032 59.1629 406.156 59.9192 404.704 61.4315C403.252 62.8833 402.526 64.8192 402.526 67.2389V96.1852H386.011Z"
                  fill="white"
                />
                <path
                  d="M64.9377 96.1851V81.6666C64.9377 78.7629 65.4217 76.2222 66.3895 74.0444C67.418 71.8062 68.9909 69.84 71.108 68.1463C73.2858 66.4525 76.0988 64.8796 79.5469 63.4277L89.6192 59.1629C92.2205 58.074 94.0958 56.7734 95.2451 55.2611C96.455 53.7488 97.0599 51.8432 97.0599 49.5444C97.0599 47.4271 96.334 45.6426 94.8821 44.1907C93.4909 42.6784 91.434 41.9222 88.7118 41.9222C85.9291 41.9222 83.8421 42.7086 82.4506 44.2815C81.0594 45.7937 80.3636 47.8506 80.3636 50.4518H64.0303C64.0303 46.0963 64.968 42.2247 66.8432 38.837C68.7187 35.4493 71.471 32.7876 75.1006 30.8518C78.7909 28.916 83.3279 27.9481 88.7118 27.9481C94.0353 27.9481 98.5118 28.8858 102.141 30.7611C105.832 32.5759 108.614 35.0864 110.49 38.2926C112.425 41.4382 113.393 45.0074 113.393 49V50.0889C113.393 55.2308 112.002 59.4655 109.219 62.7926C106.437 66.1197 101.96 69.1141 95.7895 71.7759L85.7173 76.0407C84.2655 76.6456 83.1766 77.3111 82.4506 78.037C81.7853 78.7629 81.4525 79.7308 81.4525 80.9407V84.2074L77.5506 81.6666H113.212V96.1851H64.9377Z"
                  fill="url(#paint0_linear_10_62)"
                />
              </g>
              <circle cx="47.1852" cy="21.7778" r="12.7037" fill="#707E8E" />
              <circle cx="75.315" cy="9.98148" r="9.98148" fill="#707E8E" />
              <circle cx="100.722" cy="8.16667" r="6.35185" fill="#707E8E" />
              <circle cx="119.778" cy="16.3334" r="5.44444" fill="#707E8E" />
              <circle cx="134.296" cy="29.037" r="3.62963" fill="#707E8E" />
              <defs>
                <linearGradient
                  id="paint0_linear_10_62"
                  x1="2.40817"
                  y1="59.0054"
                  x2="406.858"
                  y2="59.0054"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FF5722" />
                  <stop offset="0.114583" stop-color="#FF5B20" />
                  <stop offset="0.229167" stop-color="#FF6819" />
                  <stop offset="0.75" stop-color="#FF7D0E" />
                  <stop offset="1" stop-color="#FF9800" />
                </linearGradient>
                <clipPath id="clip0_10_62">
                  <rect
                    width="435.556"
                    height="72.5926"
                    fill="white"
                    transform="translate(0 25.4073)"
                  />
                </clipPath>
              </defs>
              <script id="bw-fido2-page-script" />
            </svg>
          </a>
        </Typography>
      </LayoutSection>
      <LayoutSection className="space-y-2 items-start">
        <Typography variant="h3">Images</Typography>
        <Typography>
          Les images utilisées sur le site web de l'association Temple Team sont
          soit la propriété de l'association Temple Team, soit utilisées avec
          l'accord de leurs propriétaires. Toute utilisation non autorisée des
          images est interdite et peut entraîner des poursuites.
        </Typography>
      </LayoutSection>
      <LayoutSection className="space-y-2 items-start">
        <Typography variant="h3">Conditions d'utilisation</Typography>
        <Typography>
          En utilisant ce site, le visiteur reconnaît avoir eu la possibilité de
          prendre connaissance des conditions d’utilisation.
          <br />
          La Temple Team s’efforce d’assurer au mieux de ses possibilités,
          l’exactitude et la mise à jour des informations diffusées sur ce site,
          dont elle se réserve le droit de corriger, à tout moment et sans
          préavis, le contenu. Toutefois, nous ne pouvons garantir l’exactitude,
          la précision ou l’exhaustivité des informations mises à la disposition
          sur ce site. En conséquence, Temple Team décline toute responsabilité
          :
          <br />
          – pour toute interruption du site
          <br />
          – survenance de bogues
          <br />
          – pour toute inexactitude ou omission portant sur des informations
          disponibles sur le site – pour tous dommages résultant d’une intrusion
          frauduleuse d’un tiers ayant entraîné une modification des
          informations mises à la disposition sur le site
          <br />– et plus généralement de tout dommage direct et indirect,
          quelles qu’en soient les causes, origines, natures ou conséquences et
          ce y compris notamment les coûts pouvant survenir du fait de
          l’acquisition de biens proposés sur le site, les pertes de profits, de
          clientèle, de données ou tout autre perte de biens incorporels pouvant
          survenir à raison de l’accès de quiconque au site, de l’impossibilité
          d’y accéder ou du crédit accordé à une quelconque information
          provenant directement ou indirectement de ce dernier.
        </Typography>
      </LayoutSection>
      <LayoutSection className="space-y-2 items-start">
        <Typography variant="h3">Avis de non-responsabilité</Typography>
        <Typography>
          Le site web de l'association Temple Team contient des liens vers
          d'autres sites web. L'association n'est pas responsable du contenu de
          ces sites web et ne peut garantir l'exactitude ou la fiabilité des
          informations qui y figurent. L'utilisation de ces sites web se fait
          aux risques et périls de l'utilisateur.
        </Typography>
      </LayoutSection>
      <LayoutSection className="space-y-2 items-start">
        <Typography variant="h3">Droits de propriété</Typography>
        <Typography>
          Le site web de l'association Temple Team, ainsi que son contenu
          (textes, images, logos, etc.) sont la propriété exclusive de
          l'association ou de ses partenaires, et sont protégés par les lois en
          vigueur relatives à la propriété intellectuelle. Toute reproduction,
          représentation, modification, publication ou adaptation, partielle ou
          intégrale, du site web ou de son contenu, sans l'autorisation
          préalable et écrite de l'association ou de ses partenaires, est
          strictement interdite et peut entraîner des poursuites.
        </Typography>
      </LayoutSection>
      <LayoutSection className="space-y-2 items-start">
        <Typography variant="h3">Crédits photos et sources</Typography>
        <Typography>
          Les photos utilisées sur le site web de l'association Temple Team sont
          créditées lorsque cela est possible. Si vous constatez une erreur ou
          une omission dans la mention des crédits photos ou des sources,
          n'hésitez pas à nous contacter à l'adresse{" "}
          <a href="mailto:contact@templeteam.fr">contact@templeteam.fr</a>.
        </Typography>
      </LayoutSection>
      <LayoutSection className="space-y-2 items-start">
        <Typography variant="h3">Lois applicables</Typography>
        <Typography>
          Le site web de l'association Temple Team est soumis aux lois en
          vigueur en France. Tout litige relatif à l'utilisation du site web
          sera soumis à la compétence des tribunaux français.
        </Typography>
      </LayoutSection>
    </Layout>
  );
}
