const expect = require('chai').use(require('dirty-chai')).expect;
const _ = require('lodash');
const pk6parse = require('../..');
const expected_pkmn1 = require('./pkmn1_expected');
const expected_kyurem = require('./kyurem-w_expected');

describe('gen 6', () => {
  it('allows a file to be parsed', () => {
    expect(pk6parse.parseFile(`${__dirname}/pkmn1.pk6`)).to.eql(expected_pkmn1);
    expect(pk6parse.parseFile(`${__dirname}/kyurem-w.pk6`)).to.eql(expected_kyurem);
  });
  it('allows a buffer to be parsed directly', () => {
    const buf = require('fs').readFileSync(`${__dirname}/pkmn1.pk6`);
    expect(pk6parse.parseBuffer(buf)).to.eql(expected_pkmn1);

    const buf2 = require('fs').readFileSync(`${__dirname}/kyurem-w.pk6`);
    expect(pk6parse.parseBuffer(buf2)).to.eql(expected_kyurem);
  });
  describe('assigns additional properties if this option is set with a flag', () => {
    it('parses a pelipper correctly', () => {
      const parsed = pk6parse.parseFile(`${__dirname}/pkmn1.pk6`, {parseNames: true});
      _.forEach(expected_pkmn1, (value, key) => expect(parsed[key]).to.deep.equal(value));
      expect(parsed.speciesName).to.equal('Pelipper');
      expect(parsed.level).to.equal(24);
      expect(parsed.expFromPreviousLevel).to.equal(495);
      expect(parsed.expToNextLevel).to.equal(1306);
      expect(parsed.heldItemName).to.be.null();
      expect(parsed.ballName).to.equal('Quick Ball');
      expect(parsed.abilityName).to.equal('Keen Eye');
      expect(parsed.natureName).to.equal('Modest');
      expect(parsed.formName).to.be.null();
      expect(parsed.increasedStat).to.equal('SpAtk');
      expect(parsed.decreasedStat).to.equal('Atk');
      expect(parsed.move1Name).to.equal('Agility');
      expect(parsed.move1Type).to.equal('psychic');
      expect(parsed.move1Power).to.be.null();
      expect(parsed.move2Name).to.equal('Water Pulse');
      expect(parsed.move2Type).to.equal('water');
      expect(parsed.move2Power).to.equal(60);
      expect(parsed.move3Name).to.equal('Payback');
      expect(parsed.move3Type).to.equal('dark');
      expect(parsed.move3Power).to.equal(50);
      expect(parsed.move4Name).to.equal('Roost');
      expect(parsed.move4Type).to.equal('flying');
      expect(parsed.move4Power).to.be.null();
      expect(parsed.eggMove1Name).to.equal('Agility');
      expect(parsed.eggMove2Name).to.be.null();
      expect(parsed.eggMove3Name).to.be.null();
      expect(parsed.eggMove4Name).to.be.null();
      expect(parsed.medals).to.eql([]);
      expect(parsed.ribbons).to.eql([]);
      expect(parsed.eggLocationName).to.be.null();
      expect(parsed.metLocationName).to.equal('Route 118');
      expect(parsed.encounterTypeName).to.be.null();
      expect(parsed.otGameName).to.equal('Omega Ruby');
      expect(parsed.countryName).to.equal('United States');
      expect(parsed.regionName).to.equal('New York');
      expect(parsed.otMemory).to.equal('not-aardvark met Teddy at... a riverside road. Teddy threw a Poké Ball at it, and ' +
        'they started to travel together. The Pokémon remembers that it grinned.');
      expect(parsed.notOtMemory).to.equal(
        'The Pokémon seems to have a good memory, but it doesn’t seem to be able to remember...'
      );
      expect(parsed.tsv).to.equal(2325);
      expect(parsed.esv).to.equal(2928);
      expect(parsed.isShiny).to.be.false();
      expect(parsed.types).to.eql(['water', 'flying']);
      expect(parsed.baseStatHp).to.equal(60);
      expect(parsed.baseStatAtk).to.equal(50);
      expect(parsed.baseStatDef).to.equal(100);
      expect(parsed.baseStatSpAtk).to.equal(85);
      expect(parsed.baseStatSpDef).to.equal(70);
      expect(parsed.baseStatSpe).to.equal(65);
      expect(parsed.statHp).to.equal(70);
      expect(parsed.statAtk).to.equal(32);
      expect(parsed.statDef).to.equal(60);
      expect(parsed.statSpAtk).to.equal(52);
      expect(parsed.statSpDef).to.equal(46);
      expect(parsed.statSpe).to.equal(40);
      expect(parsed.hiddenPowerType).to.equal('water');
      expect(parsed.hiddenPowerPower).to.equal(57);
    });
    it('parses form data correctly', () => {
      const parsed = pk6parse.parseFile(`${__dirname}/kyurem-w.pk6`, {parseNames: true});
      _.forEach(expected_kyurem, (value, key) => expect(parsed[key]).to.deep.equal(value));
      expect(parsed.formName).to.equal('White');
    });
    it('does not crash when parsing something with a neutral nature', () => {
      const dangerbug = pk6parse.parseFile(`${__dirname}/neutral-nature.pk6`, {parseNames: true});
      expect(dangerbug.increasedStat).to.be.null();
      expect(dangerbug.decreasedStat).to.be.null();
    });
    it('uses the 5th-gen datatables for things from gen 5', () => {
      const mienshao = pk6parse.parseFile(`${__dirname}/5th-gen-location.pk6`, {parseNames: true});
      expect(mienshao.metLocationName).to.equal('Dragonspiral Tower');
    });
    it('uses "Poké transfer" for locations from before gen 5', () => {
      const eevee = pk6parse.parseFile(`${__dirname}/eevee.pk6`, {parseNames: true});
      expect(eevee.metLocationName).to.equal('Poké Transfer');
      expect(eevee.metLocationId).to.equal(30001);
      expect(eevee.eggLocationName).to.equal('Day-Care Couple');
      expect(eevee.geoLocation1RegionName).to.equal('Aomori');
      expect(eevee.geoLocation1CountryName).to.equal('Japan');

      const kecleon = pk6parse.parseFile(`${__dirname}/kecleon.pk6`, {parseNames: true});
      expect(kecleon.metLocationName).to.equal('Poké Transfer');
      expect(kecleon.metLocationId).to.equal(30001);
      expect(kecleon.eggLocationName).to.equal('Link Trade');
    });
    it('handles memory ribbons correctly', () => {
      const noMemoryRibbons = pk6parse.parseFile(`${__dirname}/pkmn1.pk6`, {parseNames: true});
      const halfMemoryRibbons = pk6parse.parseFile(`${__dirname}/half_memory_ribbons.pk6`, {parseNames: true});
      const fullMemoryRibbons = pk6parse.parseFile(`${__dirname}/full_memory_ribbons.pk6`, {parseNames: true});

      expect(noMemoryRibbons.contestMemoryRibbonCount).to.equal(0);
      expect(noMemoryRibbons.battleMemoryRibbonCount).to.equal(0);
      expect(noMemoryRibbons.ribbons).to.not.include('Contest Memory Ribbon');
      expect(noMemoryRibbons.ribbons).to.not.include('Contest Memory Ribbon (Gold)');
      expect(noMemoryRibbons.ribbons).to.not.include('Battle Memory Ribbon');
      expect(noMemoryRibbons.ribbons).to.not.include('Battle Memory Ribbon (Gold)');

      expect(halfMemoryRibbons.contestMemoryRibbonCount).to.equal(20);
      expect(halfMemoryRibbons.battleMemoryRibbonCount).to.equal(4);
      expect(halfMemoryRibbons.ribbons).to.include('Contest Memory Ribbon');
      expect(halfMemoryRibbons.ribbons).to.not.include('Contest Memory Ribbon (Gold)');
      expect(halfMemoryRibbons.ribbons).to.include('Battle Memory Ribbon');
      expect(halfMemoryRibbons.ribbons).to.not.include('Battle Memory Ribbon (Gold)');

      expect(fullMemoryRibbons.contestMemoryRibbonCount).to.equal(40);
      expect(fullMemoryRibbons.battleMemoryRibbonCount).to.equal(8);
      expect(fullMemoryRibbons.ribbons).to.not.include('Contest Memory Ribbon');
      expect(fullMemoryRibbons.ribbons).to.include('Contest Memory Ribbon (Gold)');
      expect(fullMemoryRibbons.ribbons).to.not.include('Battle Memory Ribbon');
      expect(fullMemoryRibbons.ribbons).to.include('Battle Memory Ribbon (Gold)');
    });
  });
  it('allows assignReadableNames to be called on its own', () => {
    const parsedWithNames = pk6parse.parseFile(`${__dirname}/pkmn1.pk6`, {parseNames: true});
    const expected = _.cloneDeep(expected_pkmn1);
    expect(pk6parse.assignReadableNames(expected)).to.eql(parsedWithNames);
  });
  it('gives correct form names', () => {
    const popstar_pikachu = pk6parse.parseFile(`${__dirname}/popstar_pikachu.pk6`, {parseNames: true});
    expect(popstar_pikachu.formName).to.eql('Pop');
  });
});
