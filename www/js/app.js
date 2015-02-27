var app = angular.module('starter', ['ionic', 'ui.utils.masks']);

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

    $scope.ano_base = $scope.configuracao_inicial.ano_base[0];
    $scope.qualificacao = $scope.configuracao_inicial.qualificacao[7];
    $scope.relacao = $scope.configuracao_inicial.relacao[0];
    $scope.classe = $scope.configuracao_inicial.classe[0];
    $scope.nivel = $scope.configuracao_inicial.nivel[0];
    $scope.auxilio_alimentacao = $scope.configuracao_inicial.auxilio_alimentacao;
    $scope.auxilio_pre_escolar = 0;
    $scope.valor_auxilio_pre_escolar = 0.0;
    $scope.auxilio_transporte = 0.0;
    $scope.outras_gratificacoes = 0.0;
    $scope.saude_suplementar = 0.0;
    $scope.salario_bruto = 0.0;

    $scope.getPosicaoTabela($scope.classe, $scope.nivel);
    $scope.getVencimentoBasico($scope.ano_base, $scope.posicao_tabela);
    $scope.getIncentivoQualificacao($scope.qualificacao, $scope.relacao, $scope.vencimento_basico);
    $scope.getValorSalarioBruto($scope.vencimento_basico.valor, $scope.incentivo_qualificacao, $scope.auxilio_alimentacao, $scope.gratificacao, $scope.valor_periculosidade, $scope.valor_auxilio_pre_escolar, $scope.auxilio_transporte, $scope.outras_gratificacoes, $scope.saude_suplementar);
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

  $scope.getVencimentoBasico = function(ano_base, posicao_tabela) {
    $scope.vencimento_basico = null;
    tabela_remuneracao = $filter('filter')($scope.configuracao_inicial.tabela_remuneracao, {"ano_base":ano_base.texto})[0].valores;
    $scope.vencimento_basico = $filter('filter')(tabela_remuneracao, {"posicao":posicao_tabela.texto})[0];
  }

  $scope.getIncentivoQualificacao = function(qualificacao, relacao, vencimento_basico) {
    $scope.incentivo_qualificacao = null;

    if (qualificacao.percentual_direta != 0.0 || qualificacao.percentual_indireta != 0.0) {
      $scope.incentivo_qualificacao = vencimento_basico.valor * (relacao.valor == 1 ? qualificacao.percentual_direta / 100.0 : qualificacao.percentual_indireta / 100.0);
    } else {
      $scope.incentivo_qualificacao = 0.0;
    }
  };

  $scope.getValorPericusolidade = function(periculosidade, vencimento_basico) {
    $scope.valor_periculosidade = null;

    if (periculosidade != null) {
      $scope.valor_periculosidade = vencimento_basico.valor * (periculosidade.percentual / 100);
    } else {
      $scope.valor_periculosidade = 0.0;
    }
  };

  $scope.getValorAuxilioPreEscolar = function(auxilio_pre_escolar) {
    $scope.valor_auxilio_pre_escolar = null;

    if (auxilio_pre_escolar != null) {
      $scope.valor_auxilio_pre_escolar = auxilio_pre_escolar * $scope.configuracao_inicial.auxilio_pre_escolar;
    } else {
      $scope.valor_auxilio_pre_escolar = 0.0;
    }
  };

  $scope.getValorSalarioBruto = function(vencimento_basico, incentivo_qualificacao, auxilio_alimentacao, gratificacao, valor_periculosidade, valor_auxilio_pre_escolar, auxilio_transporte, outras_gratificacoes, saude_suplementar) {
    $scope.salario_bruto = vencimento_basico + incentivo_qualificacao + auxilio_alimentacao + valor_auxilio_pre_escolar + auxilio_transporte + outras_gratificacoes + saude_suplementar;

    if (gratificacao != null) {
      $scope.salario_bruto += gratificacao.valor;
    }

    if (valor_periculosidade != null) {
      $scope.salario_bruto += valor_periculosidade;
    }
  };
});
