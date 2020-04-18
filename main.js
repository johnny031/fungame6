let names = [];
let identity = [];
let setting = ["bomb"];
let round = 5;
let count = 0;
let check_seq = 0;
let identity_seq = 0;
let current_player;
let left_wire;
let gameOver = false;
$.fn.preload = function () {
  this.each(function () {
    $("<img/>")[0].src = this;
  });
};
$([
  "img/card_back.png",
  "img/remove.png",
  "img/none.png",
  "img/bomb.png",
]).preload();
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function input_show() {
  let numbers = $("#number").val();
  if (numbers < 4 || numbers > 8) {
    alert("遊戲人數需介於4至8人之間");
    return false;
  } else {
    $("#number_button").prop("disabled", true);
  }
  $("#names_title").show();
  $("#start_button").show();
  for (let i = 0; i < numbers; i++) {
    var input = document.createElement("input");
    input.type = "text";
    input.name = "n";
    input.className = i;
    input.style.display = "block";
    input.style.margin = "10px";
    input.style.padding = "5px";
    $("#input_div").append(input);
    setting.push("remove");
  }
  for (let i = 0; i < numbers * 4 - 1; i++) {
    setting.push("none");
  }
  left_wire = numbers;
  $("#left_wire").html(left_wire);
  if (numbers == 4 || numbers == 5) {
    identity = ["夏洛克", "夏洛克", "夏洛克", "莫里亞蒂", "莫里亞蒂"];
  } else if (numbers == 6) {
    identity = ["夏洛克", "夏洛克", "夏洛克", "夏洛克", "莫里亞蒂", "莫里亞蒂"];
  } else if (numbers == 7 || numbers == 8) {
    identity = [
      "夏洛克",
      "夏洛克",
      "夏洛克",
      "夏洛克",
      "夏洛克",
      "莫里亞蒂",
      "莫里亞蒂",
      "莫里亞蒂",
    ];
  }
  shuffle(identity);
}
function start() {
  let empty = false;
  $('#input_div input[type="text"]').each(function () {
    if ($(this).val() === "") {
      alert("玩家名稱請勿空白");
      empty = true;
      return false;
    }
  });
  if (empty) {
    return false;
  }
  $('input[name^="n"]').each(function () {
    names.push($(this).val());
  });
  current_player = Math.floor(Math.random() * names.length);
  $("#whos_round").html(names[current_player]);
  deal(round);
  $(".setting_div").hide();
  $(".cards_div").show();
}
function deal(round) {
  shuffle(setting);
  for (let i = 0; i < $("#number").val(); i++) {
    let tr = document.createElement("tr");
    tr.setAttribute("id", "tr" + i);
    let td_name = document.createElement("td");
    td_name.setAttribute("id", "name" + i);
    td_name.innerHTML = names[i] + "：";
    tr.append(td_name);
    for (let j = 0; j < round; j++) {
      let td = document.createElement("td");
      let btn = document.createElement("button");
      let img = document.createElement("img");
      btn.className = setting[i * round + j];
      btn.setAttribute("disabled", "disabled");
      img.setAttribute("src", "img/card_back.png");
      img.className = "img" + j;
      btn.append(img);
      td.append(btn);
      tr.append(td);
    }
    $("#cards_table").append(tr);
  }
  $("#cards_table").fadeIn(400);
}
function check_identity() {
  if (identity_seq % 2 === 0) {
    $("#identity_h5").html(names[identity_seq / 2]);
  } else {
    $("#identity_h5").html(identity[(identity_seq - 1) / 2]);
  }
  identity_seq++;
  if (identity_seq > $("#number").val() * 2) {
    $("#identity_h5").html("");
    $("#check_identity").prop("disabled", true);
  }
}
function check_cards() {
  if (check_seq % 2 === 0) {
    for (let i = 0; i < round; i++) {
      let attr = $("#tr" + check_seq / 2 + " .img" + i)
        .parent("button")
        .attr("class");
      let image = $("#tr" + check_seq / 2 + " .img" + i);
      image.fadeOut("fast", function () {
        image.attr("src", "img/" + attr + ".png");
        image.fadeIn("fast");
      });
    }
  } else {
    for (let i = 0; i < round; i++) {
      let image = $("#tr" + (check_seq - 1) / 2 + " .img" + i);
      image.fadeOut("fast", function () {
        image.attr("src", "img/card_back.png");
        image.fadeIn("fast");
      });
    }
  }
  check_seq++;
  if (check_seq >= $("#number").val() * 2) {
    $("#check_cards").prop("disabled", true);
    $("#current_round_h5").slideDown();
    shuffle_cards();
    button_enable();
    check_seq = 0;
  }
}
function shuffle_cards() {
  for (let i = 0; i < $("#number").val(); i++) {
    let attr = [];
    for (let j = 0; j < round; j++) {
      attr.push(
        $("#tr" + i + " .img" + j)
          .parent("button")
          .attr("class")
      );
    }
    shuffle(attr);
    for (let k = 0; k < round; k++) {
      $("#tr" + i + " .img" + k)
        .parent("button")
        .attr("class", attr[k]);
    }
  }
}
function button_enable() {
  $("#cards_table button").prop("disabled", false);
  $("#tr" + current_player + " button").prop("disabled", true);
}
$(document).on("click", ".none, .remove, .bomb", function () {
  setting.splice($.inArray($(this).attr("class"), setting), 1);
  current_player = $(this).closest("tr").attr("id").slice(-1);
  $("#whos_round").html(names[current_player]);
  button_enable();
  let image = $(this).children("img");
  image.fadeOut(200, function () {
    image.attr("src", "img/" + image.parent("button").attr("class") + ".png");
    image.fadeIn(200);
  });
  setTimeout(() => {
    if ($(this).attr("class") === "remove") {
      left_wire--;
      $("#left_wire").html(left_wire);
      alert("解除一條引線！");
      if (left_wire === 0) {
        alert("已解除所有引線，夏洛克陣營獲勝，遊戲結束");
        over();
        return false;
      }
    } else if ($(this).attr("class") === "bomb") {
      alert("炸彈被觸發，莫里亞蒂陣營獲勝，遊戲結束");
      over();
      return false;
    }
  }, 500);
  count++;
  if (count == $("#number").val()) {
    round--;
    count = 0;
    $("#current_round_h5").slideUp();
    setTimeout(() => {
      if (!gameOver) {
        if (round === 1) {
          alert("過四回合而引線尚未被全部解除，莫里亞蒂陣營獲勝，遊戲結束");
          over();
          return false;
        }
        $("#cards_table").fadeOut(400, function () {
          $("#cards_table").html("");
          deal(round);
        });
        $("#check_cards").prop("disabled", false);
      }
    }, 600);
  }
});
function over() {
  gameOver = true;
  $("button").prop("disabled", true);
}
