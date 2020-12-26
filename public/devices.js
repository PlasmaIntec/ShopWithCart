$(document).ready(() => {
	$.get("/inventory", (data) => {
		makeTable($(".item-table"), data.query)
	})

	$(document).on("click", ".add", (e) => {
		var name = $("#customer-name").val()
		var item = $(e.target).data("item-name")
		$.post(`/assign?${$.param({ name, item })}`, (data) => {
			if (!data.query?.length) {
				var name = $("#customer-name").val()
				$(".error-message").text(`${name} does not exist`)
				return
			}
			$.get("/inventory", (data) => {
				makeTable($(".item-table"), data.query)
			})
		})
	})
	
	$(document).on("click", ".remove", (e) => {
		var item = $(e.target).data("item-name")
		$.post(`/return?${$.param({ item })}`, (data) => {
			if (!data.query?.length) {
				var name = $("#customer-name").val()
				$(".error-message").text(`${name} does not exist`)
				return
			}
			$.get("/inventory", (data) => {
				makeTable($(".item-table"), data.query)
			})
		})
	})

	$(document).on("keypress", "#cart", (e) => {
		if (e.which == 13 && !e.shiftKey) {
			e.preventDefault();
			var cart = $("#cart").val()
			$.post(`/emptyCartById?${$.param({ cart })}`, () => {
				$.get("/inventory", (data) => {
					makeTable($(".item-table"), data.query)
				})
			})			
		}
	})
})

var makeTable = (container, data) => {
	container.empty()
	var table = $("<table>")

	var row = $("<tr>")
	Object.keys(data[0]).forEach((key) => {
		row.append($("<th>").text(key))
	})
	row.append($("<th>").text("remove"))
	table.append(row)
	data = sortData(data)

	data.forEach((r) => {
		var row = $("<tr>")
		Object.values(r).forEach((value, i) => {
			var className = Object.keys(r)[i]
			if (value) {
				if (r.cartid && i == 0) {
					row.append($("<td>").text(`    ${value}`).addClass(className))
				} else {
					row.append($("<td>").text(value).addClass(className))
				}
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

var sortData = (data) => {
	var noCart = data.filter(e => !e.cartid)
	var withCart = data.filter(e => e.cartid)
	for (var item of withCart) {
		var index = noCart.findIndex(e => e.itemid == item.cartid)
		noCart.splice(index+1, 0, item)
	}
	return noCart
}