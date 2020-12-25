$(document).ready(() => {
	$.get("/inventory", (data) => {
		makeTable($(".item-table"), data.query)
	})

	$(document).on("click", ".add", (e) => {
		var name = $("#customer-name").val()
		var item = $(e.target).data("item-name")
		$.post(`/assign?${$.param({ name, item })}`, (data) => {
			var row = $(e.target).parent().parent() // button inside td
			var data = data.query[0]
			updateRow(row, data)
		})
	})
	
	$(document).on("click", ".remove", (e) => {
		var item = $(e.target).data("item-name")
		$.post(`/return?${$.param({ item })}`, (data) => {
			var row = $(e.target).parent().parent() // button inside td
			var data = data.query[0]
			updateRow(row, data)
		})
	})
})

var updateRow = (row, data) => {
	if (!data) {
		var name = $("#customer-name").val()
		$(".error-message").text(`${name} does not exist`)
		return
	}
	$(".error-message").text("")
	var name = data.customername
	var nameElement = row.find(".customername")
	var newElement = $("<td>")
	if (name) {
		newElement.text(name).addClass("customername")
	} else {
		newElement
			.addClass("customername")
			.append(
				$("<button>")
					.text("add")
					.addClass("add")
					.data("item-name", data.itemname)
			)
	}
	nameElement.replaceWith(newElement)
}

var makeTable = (container, data) => {
	var table = $("<table>")

	var row = $("<tr>")
	Object.keys(data[0]).forEach((key) => {
		row.append($("<th>").text(key))
	})
	row.append($("<th>").text("remove"))
	table.append(row)

	data.forEach((r) => {
		var row = $("<tr>")
		Object.values(r).forEach((value, i) => {
			var className = Object.keys(r)[i]
			if (value) {
				row.append($("<td>").text(value).addClass(className))
			} else {
				row.append(
					$("<td>")
						.addClass(className)
						.append(
							$("<button>")
								.text("add")
								.addClass("add")
								.data("item-name", r.itemname)
						)
				)
			}
		})
		row.append(
			$("<td>")
				.append(
					$("<button>")
						.text("remove")
						.addClass("remove")
						.data("customer-name", r.customername)
						.data("item-name", r.itemname)
					)
		)
		table.append(row)
	})
	container.append(table)
}