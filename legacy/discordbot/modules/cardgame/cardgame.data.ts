// type definitions

export enum limit {
    attack_category,
    unlimited,
}
export interface damage {
    self?: number,
    target?: number,
    percentage?: boolean,
}
export enum from {
    self_random,
    self_select,
    enemy_random,
    enemy_select,
}
export enum alive_until {
    flip_heads,
    flip_tails,
    round_ends,
}
export enum trigger {
    round_begin,
    round_end
}
export enum target {
    self, enemy, both
}
export interface buff {
    healing: boolean,
    aim: target,
    when: trigger,
    life: alive_until,
    actions: action[],
}
export interface modifier {
}
export enum effedct {

}
export interface action {
    attack?: damage,
    heal?: damage,
    pick_card?: from,
    // transforms card into the chosen card. do not destroy other card. replace it with the same as chosen.
    transform_card?: from,
    discard_card?: from,
    // defines whether any of the card actio (pick, transform and discard) should be revealed when action is taken
    show_card?: boolean,

    /*** MODIFIERS ***/

    // emits the whole next damaging attack, if number > 1 it is said to have multiple times of this protection
    protection?: number,
    // mirrors the whole next damaging attack, if number > 1 it is said to have multiple times of this
    mirror_attack?: number,
    // cleanse debuffs on player
    cleanse?: boolean,
    // purges buffs on target
    purge?: boolean,
    // clones all enemy buffs to the player self
    clone_enemy_buffs?: boolean,
    // reveals all enemy cards to public view
    reveal_enemy_cards?: boolean,
    // redraws all the cards
    redraw_all_cards?: boolean,
    // paralyze
    paralyze?: boolean,
}
export interface flip_coin {
    heads?: action,
    tails?: action,
}
export interface card {
    // applies a certain limit on card play, i.e if thats an attack card
    // player can only play one attack card per round
    play_limit: limit,
    // instantaneous actions soon as card is played
    actions?: action[],
    flips?: flip_coin[],
    // if true flips[] will be not fully iterated when a coin is tail
    tail_break?: boolean,
    buffs?: buff[],
}

// card database

export enum card_no {
    efsanevi_ataturk = 1,
    hasan_mezarci, muzlu_ajdar, koca_isteyen_kari, korkusuz_korkak,
    kara_murat_benim, yossi_kohen, usta_rakun, zikir_halkasi,
    // 10=
    erotik_ajdar, yengec_risitas, gozleri_kayan_acun, halay, tivorlu_ismail,
    // 15=
    changerboyle, tatar_ramazan
}
export const cards: { [key in card_no]: card } = {
    [card_no.efsanevi_ataturk]: {
        play_limit: limit.unlimited,
        actions: [
            { cleanse: true },
            { purge: true },
            { heal: { self: 1.0, percentage: true } }
        ]
    },
    [card_no.hasan_mezarci]: {
        play_limit: limit.unlimited,
        buffs: [
            {
                healing: false,
                aim: target.enemy,
                when: trigger.round_begin,
                life: alive_until.round_ends,
                actions: [
                    { paralyze: true }
                ]
            }
        ]
    },
    3: {
        play_limit: limit.unlimited
    },
    [card_no.koca_isteyen_kari]: {
        play_limit: limit.unlimited,
        flips: [
            { heads: { cleanse: true } },
            { heads: { attack: { target: 20 } } },
        ],
        tail_break: true,
    },
    [card_no.korkusuz_korkak]: {
        play_limit: limit.attack_category,
        flips: Array(5).fill({ heads: { attack: { target: 20 } } }),
        tail_break: true,
    },
    [card_no.kara_murat_benim]: {
        play_limit: limit.attack_category,
        actions: [
            { attack: { target: 10 } },
        ],
        flips: [
            { heads: { attack: { target: 10 } } },
            { heads: { attack: { target: 10 } } },
        ],
    },
    [card_no.yossi_kohen]: {
        play_limit: limit.unlimited,
        actions: [
            { mirror_attack: 1 },
            { clone_enemy_buffs: true },
        ]
    },
    [card_no.usta_rakun]: {
        play_limit: limit.unlimited,
        actions: [
            { discard_card: from.self_select, show_card: true },
            { pick_card: from.self_select, show_card: true },
        ]
    },
    [card_no.zikir_halkasi]: {
        play_limit: limit.unlimited,
        actions: [
            { redraw_all_cards: true },
        ]
    },
    [card_no.erotik_ajdar]: {
        play_limit: limit.unlimited,
        actions: [
            { reveal_enemy_cards: true },
        ]
    },
    [card_no.yengec_risitas]: {
        play_limit: limit.unlimited,
        buffs: [
            {
                healing: false,
                aim: target.enemy,
                when: trigger.round_end,
                life: alive_until.flip_heads,
                actions: [
                    { attack: { self: 20 } }
                ]
            },
        ]
    },
    [card_no.gozleri_kayan_acun]: {
        play_limit: limit.unlimited,
        actions: [
            { protection: 1 },
        ],
    },
    [card_no.halay]: {
        play_limit: limit.unlimited,
        flips: [
            { heads: { pick_card: from.self_select } }
        ],
    },
    [card_no.tivorlu_ismail]: {
        play_limit: limit.attack_category,
        actions: [
            { attack: { target: 20 } },
        ],
        flips: [
            { heads: { attack: { target: 10 } } },
            { heads: { attack: { target: 10 } } },
            { heads: { attack: { target: 10, self: 20 } } }
        ],
        tail_break: true,
    },
    15: {
        play_limit: limit.unlimited,
        flips: [
            { heads: { transform_card: from.enemy_select } }
        ],
    },
    [card_no.tatar_ramazan]: {
        play_limit: limit.attack_category,
        flips: [{ heads: { attack: { target: 40 } } }]
    },
}