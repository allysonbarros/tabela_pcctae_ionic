var app = angular.module('starter', ['ionic']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.controller('SimulacaoController', function($scope, $http, $filter) {
  $scope.configuracao_inicial = null;

  // Carregando o JSON inicial.
  $http.get('/initial_data.json').success(function(data) {
    $scope.configuracao_inicial = data;

    $scope.ano_base = $scope.configuracao_inicial.ano_base[3];
    $scope.qualificacao = $scope.configuracao_inicial.qualificacao[7];
    $scope.relacao = $scope.configuracao_inicial.relacao[0];
    $scope.classe = $scope.configuracao_inicial.classe[0];
    $scope.nivel = $scope.configuracao_inicial.nivel[0];
    $scope.posicao_tabela = null;

    $scope.getPosicaoTabela($scope.classe, $scope.nivel);
  }).error(function() {
    alert('Ocorreu um erro ao carregar as configurações do sistema.');
  });

  $scope.getPosicaoTabela = function(classe, nivel) {
    $scope.posicao_tabela = null;
    classe_nivel = classe.texto + '-' + nivel.valor;

    angular.forEach($scope.configuracao_inicial.posicao_tabela, function(posicao_tabela) {
      angular.forEach(posicao_tabela.classes, function(classe) {
        if (classe.valor == classe_nivel) {
          $scope.posicao_tabela = posicao_tabela;
        }
      });
    });
  };
});
