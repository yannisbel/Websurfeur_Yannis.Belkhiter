export const mediation = {
    'grid-strat': {
        step1: { // battue
            text: "Si on a un nombre de gendarme égal à une largeur de la grille, on peut alors former un mur qui va contraindre le voleur à se retrouver coincé sur un bord de la grille.<br><br>Cependant, il est possible d'optimiser la stratégie.",
            img: 'assets/mediation/world3/classic_beat.gif'
        },
        step2: { // Battue minimisé
            text: "Si on a un nombre de gendarme égal à la moitié de la largeur de la grille, on peut tout de même appliquer une stratégie similaire à la stratégie précédente afin de gagner. En effet, même si le mur formé (supposons vertical) par les gendarmes est \"troué\", le voleur va quand même devoir reculer jusqu'au bord de la grille. Et si ce dernier essaie de passer dans un des trous du mur, alors un des gendarmes peut monter ou descendre afin de l'arrêter.<br><br>Même si cette stratégie est plus optimisée que la précédente, elle reste encore très loin d'être optimale notamment pour les très grandes grille.",
            img: 'assets/mediation/world3/upgrade_beat.gif'
        },
        step3: { // Blocage de tous les mouvements
            text: "Sur une grille, avec 4 gendarmes, on peut finir par attraper le voleur. En effet, à chaque tour le voleur peut se déplacer sur, au plus, 4 sommets (en plus de celui sur lequel il est), un au dessus, un en dessous, un à gauche et un à droite. Les 4 gendarmes peuvent donc se spécialiser : l'un d'eux a pour but de se retrouver sur la case juste au dessus du voleur, un autre sur la case juste en dessous, etc ….<br>Pour se faire, le gendarme qui veut se retrouver sur la case juste au dessus du voleur, va d’abord chercher à se mettre au dessus du voleur dans la même colonne, puis à s’en rapprocher tant que le voleur ne change pas de colonne. Les autres gendarmes appliquent des stratégies similaires en fonction de la case visée.",
            img: 'assets/mediation/world3/blocking.gif' // changer le gif
        },
        step4: { // Strat opti
            text: "On peut sur une grille, et ce quel que soit sa taille, gagner avec seulement 2 gendarmes. En effet, il suffit pour cela que l'un des gendarmes contrôle la ligne sur laquelle se trouve le voleur tandis que l'autre gendarme contrôle la colonne sur laquelle se trouve le voleur. Pour \"contrôler\" la ligne (respectivement la colonne) du voleur, il faut que le gendarme commence par rejoindre la ligne (respectivement la colonne) sur laquelle est le voleur, puis s'il est déjà sur cette dernière alors il se rapproche du voleur.",
            img: 'assets/mediation/world3/control.gif'
        },
        step5: {
            text: "Sur un grille avec un gendarme, si le voleur se place pas initialement à une distance de plus de 1 du gendarme. Alors, il suffira au voleur de toujours chercher à se placer sur une colonne ou une ligne qui n'est pas contrôler par le gendarme",
            img: 'assets/mediation/world3/1cop.gif'
        },
        step6: { // Vitesse 2
            text: "To do",
            img: undefined
        },
    },
    'intro': {
        step1: { // Path
            // Revoir la fin de l'explication
            text: "Sur un chemin, en plaçant un gendarme sur une extrémité du chemin et en avançant en direction du voleur, alors le voleur finira par atteindre l'autre extrémité du chemin et finira pas se faire arrêter.",
            img: 'assets/mediation/world1/path.gif'
        },
        step2: { // Cycle 1 cops
            text: "Sur un cycle avec 1 seul gendarme, le voleur peut fuir éternellement. En effet, il suffit au voleur de se placer et se déplacer systématiquement sur le sommet diamétralement opposé au gendarme.",
            img: 'assets/mediation/world1/cycle1cop.gif'
        },
        step3: { // Caterpillar
            text: 'Sur un graphe "chenille"*, la stratégie est très similaire à celle utilisée sur les chemins. Il faut donc placer le gendarme sur une extrémité du chemin et le faire avancer sur le chemin en direction du voleur. La différence avec la stratégie du chemin est que le voleur ne finira pas, forcément, sur l\'autre extrémité du chemin, il est aussi possible qu\'il finisse sur une "patte de la chenille".<br><br>*un graphe "chenille" est un graphe qui est composé d\'un chemin et d\'autres sommets qui lui sont adjacents.',
            img: 'assets/mediation/world1/caterpillar.gif'
        },
        step4: { // Tree
            text: "En plaçant un gendarme sur un arbre, on sépare l'arbre en plusieurs sous-graphes disjoints (qui n'ont pas d'arrêtes qui les lient) sans cycle. Une fois le voleur placé, il se trouvera forcément sur l'un de ces sous-arbres.<br>En se déplaçant vers le voleur, 2 cas sont possibles :<br>\t- <strong>le gendarme se déplace sur un sommet de degré 2 :</strong> dans ce cas cela reduit la taille du sous-arbre dans lequel se trouve le voleur.<br>\t- <strong>Le gendarme se déplace sur un sommet avec un degré plus que 2 :</strong> dans ce cas, le gendarme divise à nouveau le sous-graphe dans lequel se trouve le voleur en plusieurs nouveau sous-arbre.<br>En répétant ce processus, le voleur finira sur une des feuilles de l'arbre (sommet de l'arbre de degré 1).",
            img: 'assets/mediation/world1/tree.gif'
        },
        step5: { // Cycle 2 cops
            text: "Sur un cycle, avec 2 gendarmes, on peut encadrer le voleur. En effet, après avoir positionné les gendarmes, si l'on se rapproche du voleur avec un gendarme par un côté et de l'autre côté avec le second gendarme, le voleur finira par être encadré par des gendarmes et n'avoir plus aucun mouvement de disponible.",
            img: 'assets/mediation/world1/cycle2cops.gif'
        }
    },
    'dominant': {
        step1: { // 2 dominants visible
            text: "Dans un graphe, on peut déterminer un <strong>ensemble dominant*</strong>. Si on a un nombre de gendarme égal au nombre de sommets dans l'ensemble dominant, il nous suffit alors de placer les gendarmes sur les différents sommets de l'ensemble afin qu'au tour suivant, qu'importe où se trouve le voleur, il sera capturer par un des gendarmes.<br><br><strong>*</strong> Ensemble de sommets tel que n'importe quel autre sommet du graphe est voisin d'au moins un des sommets de l'ensemble.",
            img: 'assets/mediation/world2/dominant2.gif'
        },
        step2: { // Petersen 2 policiers
            text: "Ce graphe s’appelle le graphe de Petersen. Dans ce graphe, quelles que soient les positions initiales des gendarmes, il existe au moins un sommet qui n'est pas adjacent à chacun des policiers où le voleur peut se placer. Au cours du jeu, quelles que soient les positions des gendarmes, si le voleur est voisin d’au moins un gendarme, il existe toujours un de ses voisins qui est à distance 2 des deux gendarmes. Le voleur peut donc s’échapper indéfiniment.", 
            img: 'assets/mediation/world2/petersen2cops.gif'
        },
        step3: { // Petersen 3 policiers
            text: "Ce graphe possède une ensemble dominant de taille 3, avec ce qu'on a vu au premier niveau de ce monde on peut donc en conclure que 3 gendarmes sont suffisants pour assurer la victoire aux gendarmes. De plus, avec ce qu'on a vu au niveau précédent il faut au moins 3 gendarmes pour que les gendarmes puissent gagner.",
            img: 'assets/mediation/world2/petersen3cops.gif'
        },
        step4: { // 3 dominants 
            text: "Dans ce graphe, il y a un ensemble dominant de taille 3.",
            img: 'assets/mediation/world2/hidden_dominant_3.gif'
        },
        step5: { // 3 dominants 
            text: "Dans ce graphe, il y a un ensemble dominant de taille 3.",
            img: undefined
        }
    },
    'separator': {
        // ajouter explication des 2-arbre
        step1: { // 2-arbre 1 policier, voleur vitesse 3
            text: "En plaçant le gendarme et prenant en compte ses sommets adjacents, on divise le graphe en plusieurs sous-graphes. Si le voleur ne veut pas se faire attraper au tour suivant, il devra se placer dans l'un de ces sous-graphes.<br>En rapprochant le gendarme du voleur, la taille du sous-graphe dans lequel se trouve le voleur va diminuer et, parfois, être à nouveau diviser en sous-graphe.<br>En répétant le processus le voleur finira sur un sommet au bord du graph.",
            img: undefined
        },
        step2: { // 2-arbre 1 policier, voleur vitesse 3
            text: "Les sous-graphes, séparés par le gendarme et les sommets qu'il contrôle, sont séparés par au plus 2 sommets, sous le contrôle du gendarme. Ainsi grâce à sa vitesse de 3, le voleur peut passé d'un sous-graphe à un autre, lui permettant ainsi de ne pas être bloquer dans un sous-graphe.",
            img: undefined
        },
        step3: { // 2-arbre 2 policier, voleur vitesse 3
            text: "Dans ce type de graphe, si l'on place 2 gendarmes sur des sommets adjacents (qui ne sont pas sur le même bord du graphe), on sépare alors le graphe en deux sous-graphes grâce aux gendarmes qui forme un mur au travers duquel le voleur ne peut pas passer. En déplaçant ce mur vers le voleur, on va le pousser jusqu'à une extrémité du grâce où le voleur ne pourra plus se déplacer.",
            img: undefined
        },
        step4: { // 2 arbre réduit
            text: "Ce graphe est formé à partir d'un 2-arbre auquel on a retiré certaines arêtes. En ayant retirer des arêtes, on a créer des cycles au sein du graphe. Ainsi si le voleur se place sur (ou atteint) l'un de ces cycles, alors pourra tourner autour de ce cycle éternellement sans que le policier ne puissent l'attraper.",
            img: undefined
        },
        step5: { // graphe cordal
            text: "To do",
            img: undefined
        }
    }
}