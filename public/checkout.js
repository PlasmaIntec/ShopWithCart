var total = 0
var itemIdSet = new Set()

$(document).ready(() => {
	$(document).on("keypress", "#item-id", (e) => {
		if (e.which == 13 && !e.shiftKey) {
			e.preventDefault();
			selectDevice()
		}
	})

	$(document).on("keypress", "#teacher-id", (e) => {
		if (e.which == 13 && !e.shiftKey) {
			e.preventDefault();
			selectDevice()
		}
	})

	$(document).on("click", ".add", (e) => {
		selectDevice()
	})

	$(document).on("click", ".confirm", (e) => {
		checkoutDevices()
	})
})

var selectDevice = () => {
	var item = $("#item-id").val()
	var name = $("#teacher-id").val()
	if (!item || !name) {
		$(".error-message").text("incomplete form")
		return
	}
	if (itemIdSet.has(item)) {
		$(".error-message").text("already added")
		return
	}
	$.get(`/owner?${$.param({ item })}`, (data) => {
		var customerId = data.query[0].customerid
		var itemName = data.query[0].itemname
		if (customerId == null) {
			total += 1
			$(".checkout").append(
				$("<div>")
					.text(`Scanned item: ${itemName}`)
			)
			$(".total").text(total)
			$(".error-message").text("")
			itemIdSet.add(item)
		} else {
			$(".error-message").text("item checked out")
		}
	})
}

var checkoutDevices = () => {
	var name = $("#teacher-id").val()
	if (!name) {
		$(".error-message").text("incomplete form")
		return
	}
	if (itemIdSet.size == 0) {
		$(".error-message").text("nothing added")
		return
	}
	Promise.all([...itemIdSet].map((item) => {
		return new Promise((resolve, reject) => {
			$.post(`/assignById?${$.param({ name, item })}`, (data) => {
				resolve(data)
			})
		})
	})).then((data) => {
		total = 0
		$(".checkout").empty()
		$(".total").text(total)
		$(".error-message").text("success")
	})
}