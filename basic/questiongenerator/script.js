function generateQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  document.getElementById("question").textContent = questions[randomIndex];
};

const questions = [
  "Antonio Marcos tinha 12 maçãs. Ele comeu 3 e deu 4 para o Denis. Depois, o Denis devolveu metade do que recebeu. Quantas maçãs Antonio Marcos ficou no final? Sinalize o resultado ao identificar a sala de resgate.",

  "Frankarlos pensou em um numero e somou 5, depois, o Murillo multiplicou por 2 e o Camyro subtraiu por 8. Se no final deu 18, qual era o numero pensado por Frankarlos? Sinalize o resultado.",

  "Henrique estava organizando seus livros em 36 pilhas, com 3 livros em cada pilha. Quantos livros ele tinha no total? Sinalize o resultado ao identificar um obstáculo.",

  "Vinicius e Henrique trabalham numa padaria. Henrique fez 18 bandejas de brigadeiros e Vinicius colocou 15 brigadeiros em cada bandeja. Quantos brigadeiros eles fizeram juntos? Sinalize o resultado ao identificar a sala de resgate.",

  "Henrique comprou 96 doces e seu irmão Vinicius o ajudou a dividir igualmente entre seus 8 primos. Quantos doces cada primo vai ganhar? Sinalize o resultado ao passar por uma intersecção.",

  "Vinicius tinha 150 cartas de Pokémon e seu amigo Cleverson o ajudou a separar 20% delas para trocar no recreio. Quantas cartas Vinicius e Cleverson separaram para trocar? Sinalize o resultado ao identificar um obstáculo.",

  "Frankarlos e Thiago foram comprar um videogame que custava 500 reais. O vendedor Camyro ofereceu 25% de desconto. Qual o preço final que Frankarlos e Thiago vão pagar? Sinalize o resultado ao identificar um obstáculo.",

  "Na mercearia da dona Enzia, seu funcionário Angelo recebe caixas com 24 garrafas de refrigerante cada. Hoje Angelo recebeu 18 caixas. Quantas garrafas Enzia e Angelo receberam no total? Sinalize o resultado ao entrar na sala de resgate.",

  "Thiago tinha 30 figurinhas e pediu ajuda para seu pai Frankarlos para dividir igualmente entre seus 10 colegas de classe. Quantas figurinhas cada colega de Thiago recebeu? Levante a garra o tanto de vezes do resultado.",

  "A professora Mel e a coordenadora Enzia tinham 400 adesivos para distribuir igualmente entre 100 alunos da escola. Quantos adesivos cada aluno vai receber? Pisque verde o tanto de vezes do resultado.",

  "Kaua e Ana Cecilia foram comprar cartas colecionáveis. Kaua comprou 12 pacotes, cada um com 2 cartas raras. Ana Cecilia ajudou ele a dividir todas as cartas raras entre 4 amigos, mas Kaua guardou 4 cartas para ele. Quantas cartas raras cada amigo recebeu? Pisque laranja o tanto de vezes do resultado.",

  "Murillo e Thiago foram ao cinema. Thiago comprou 8 pacotes de pipoca e Murillo comprou 7 pacotes. Cada pacote custava 12 reais. Quanto eles gastaram juntos com pipoca? Sinalize o resultado ao identificar a sala de resgate.",

  "O jardineiro Frankarlos e sua assistente Ana Cecília plantaram 144 mudas de flores em canteiros. Eles fizeram 12 canteiros com a mesma quantidade de mudas em cada um. Quantas mudas Frankarlos e Ana Cecilia plantaram em cada canteiro? Pisque azul o tanto de vezes do resultado.",

  "Frankarlos tinha 240 adesivos e sua prima Manuela o ajudou a colar em 6 álbuns, colocando a mesma quantidade em cada álbum. Quantos adesivos Frankarlos e Manuela colaram em cada álbum? Sinalize o resultado ao identificar um obstáculo.",

  "O padeiro Antônio fez 15 pães de açúcar para cada uma das 8 bandejas que sua esposa Bianca preparou. Quantos pães de açúcar Antônio e Bianca fizeram no total? Sinalize o resultado ao fazer uma curva de 90 graus.",

  "A bibliotecária Enzia e o estagiário Dennis organizaram 540 livros em 9 estantes iguais. Quantos livros Enzia e Dennis colocaram em cada estante? Sinalize o resultado ao identificar um beco sem saída.",

  "Sofia comprou 6 caixas de bombons para dividir com sua irmã Mel. Cada caixa tinha 25 bombons. Elas decidiram comer metade e guardar o resto. Quantos bombons Sofia e Mel guardaram? Sinalize o resultado ao passar por uma intersecção.",

  "O mecânico Thiago e seu ajudante José consertaram 7 carros na segunda-feira, 9 carros na terça-feira e 6 carros na quarta-feira. Quantos carros Thiago e José consertaram nesses três dias? Ao iniciar levante a garra o tanto de vezes do resultado.",

  "O fruteiro Marcos e sua filha Enzia venderam 13 caixas de maçãs pela manhã e 17 caixas à tarde. Cada caixa tinha 20 maçãs. Quantas maçãs Marcos e Enzia venderam durante todo o dia? Sinalize o resultado ao chegar na linha de chegada.",

  "Camyro tinha 180 doces e sua amiga Kauany o ajudou a fazer pacotinhos com 15 doces cada um. Quantos pacotinhos Camyro e Kauany conseguiram fazer? Sinalize o resultado.",

  "Explore os labirintos e sinalize quando entrar na sala de resgate.",

  "Navegue pelo percurso e sinalize quando encontrar um beco sem saída.",

  "Percorra o trajeto e sinalize quando encontar verdes.",

  "Prepare-se para a missão e sinalize ao iniciar o robô.",

  "Dê uma volta completa de 360º quando iniciar o robô.",
  
  "Ao iniciar o robô fique parado por 5 segundos.",
];